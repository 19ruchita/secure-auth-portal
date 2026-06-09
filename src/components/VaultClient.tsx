"use client"

import { useState, useEffect, useRef } from "react"
import { startAuthentication } from "@simplewebauthn/browser"
import { FadeIn, AnimatedButton, AnimatedInput } from "@/components/AnimatedUI"

interface VaultAsset {
  id: string
  title: string
  assetType: "DOCUMENT" | "FINANCIAL" | "CREDENTIAL"
  createdAt: string
}

export default function VaultClient({ hasPasskey }: { hasPasskey: boolean }) {
  const [assets, setAssets] = useState<VaultAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  // Upload Form State
  const [title, setTitle] = useState("")
  const [assetType, setAssetType] = useState<"DOCUMENT" | "FINANCIAL" | "CREDENTIAL">("DOCUMENT")
  const [fileBase64, setFileBase64] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const [dragOver, setDragOver] = useState(false)
  
  // Step-Up Verification & Preview State
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [verifiedAsset, setVerifiedAsset] = useState<{ title: string; secureUrl: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch metadata of all vault items
  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/vault")
      if (res.ok) {
        const data = await res.json()
        setAssets(data)
      }
    } catch (err) {
      console.error("Failed to load vault assets:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setFileBase64(reader.result as string)
      setFileName(file.name)
      if (!title) {
        // Auto-fill title with file name without extension
        setTitle(file.name.replace(/\.[^/.]+$/, ""))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileBase64 || !title) return

    setUploading(true)
    setError(null)

    try {
      const res = await fetch("/api/vault/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          assetType,
          secureUrl: fileBase64
        })
      })

      if (res.ok) {
        setTitle("")
        setFileBase64(null)
        setFileName("")
        fetchAssets()
      } else {
        const errData = await res.json()
        setError(errData.error || "Upload failed")
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload asset")
    } finally {
      setUploading(false)
    }
  }

  // Step-Up Verification Trigger
  const handleViewAsset = async (assetId: string) => {
    setVerifyingId(assetId)
    setError(null)
    setVerifiedAsset(null)

    try {
      // 1. Get assertion options from Server
      const optionsRes = await fetch("/api/vault/challenge/options")
      if (!optionsRes.ok) {
        const errData = await optionsRes.json()
        throw new Error(errData.error || "Failed to initiate verification challenge")
      }
      const options = await optionsRes.json()

      // 2. Trigger browser's native biometric prompt (navigator.credentials.get)
      const credential = await startAuthentication(options)

      // 3. Send signature verification request to Server
      const verifyRes = await fetch("/api/vault/challenge/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId,
          credential
        })
      })

      if (!verifyRes.ok) {
        const errData = await verifyRes.json()
        throw new Error(errData.error || "Biometric validation failed")
      }

      const verifyData = await verifyRes.json()

      // Find original asset title
      const originalAsset = assets.find(a => a.id === assetId)

      // 4. Temporarily unlock and show asset
      setVerifiedAsset({
        title: originalAsset?.title || "Sensitive Document",
        secureUrl: verifyData.secureUrl
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Biometric verification failed")
    } finally {
      setVerifyingId(null)
    }
  }

  return (
    <div className="space-y-10">
      {/* Banner message for missing passkeys */}
      {!hasPasskey && (
        <FadeIn delay={0.25}>
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-semibold text-sm">Biometric Security Required</h4>
              <p className="text-xs text-amber-400/80 mt-1">
                You must register a Passkey on your Profile Dashboard before you can view documents in the private vault.
              </p>
            </div>
          </div>
        </FadeIn>
      )}

      {error && (
        <FadeIn>
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </FadeIn>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form Panel */}
        <FadeIn delay={0.3} className="lg:col-span-1">
          <div className="p-6 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-medium">Archive New Asset</h3>
              <p className="text-xs text-muted-foreground mt-1">Add a sensitive item to your encrypted repository.</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Asset Title</label>
                <AnimatedInput 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g., Passport, Rail Ticket"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Category</label>
                <select 
                  value={assetType} 
                  onChange={(e: any) => setAssetType(e.target.value)}
                  className="w-full px-4 py-3 bg-black text-white border border-white/10 rounded focus:outline-none focus:ring-1 focus:ring-white transition-all text-sm"
                >
                  <option value="DOCUMENT">Document / Identity</option>
                  <option value="FINANCIAL">Financial Record</option>
                  <option value="CREDENTIAL">Backup Credential</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Secure File</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                    dragOver 
                      ? "border-white bg-white/5" 
                      : fileBase64 
                      ? "border-emerald-500/50 bg-emerald-500/5" 
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg className={`w-8 h-8 ${fileBase64 ? "text-emerald-400" : "text-muted-foreground"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {fileBase64 ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      )}
                    </svg>
                    <span className="text-xs font-medium text-white/90">
                      {fileName ? fileName : "Drag & Drop or Click to Select"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">Any document type (up to 4MB)</span>
                  </div>
                </div>
              </div>

              <AnimatedButton 
                type="submit" 
                disabled={uploading || !fileBase64 || !title}
                className="w-full py-3 bg-white text-black font-semibold rounded-md shadow hover:bg-neutral-200 transition-all text-sm flex items-center justify-center gap-2"
              >
                {uploading ? "Encrypting & Saving..." : "Archive Document"}
              </AnimatedButton>
            </form>
          </div>
        </FadeIn>

        {/* Existing Vault Items Grid */}
        <FadeIn delay={0.4} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Secured Assets ({assets.length})</h3>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Locked behind WebAuthn</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-6 rounded-xl border border-white/5 bg-[#050505] animate-pulse h-36"></div>
              ))}
            </div>
          ) : assets.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-white/5 bg-[#050505] space-y-3">
              <svg className="w-10 h-10 text-muted-foreground mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4h12z" />
              </svg>
              <h4 className="text-sm font-medium">Vault Empty</h4>
              <p className="text-xs text-muted-foreground">No documents have been archived yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="p-6 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-xl hover:border-white/20 transition-all flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider font-semibold border ${
                          asset.assetType === "DOCUMENT" 
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                            : asset.assetType === "FINANCIAL" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        }`}>
                          {asset.assetType}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-white/95 line-clamp-1">{asset.title}</h4>
                    </div>
                    <div className="h-8 w-8 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {asset.assetType === "DOCUMENT" ? (
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : asset.assetType === "FINANCIAL" ? (
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 01-2 2m2-2a2 2 0 00-2-2m2 2v4a2 2 0 01-2 2M1 18l3-3m0 0l-3-3m3 3h12a5 5 0 005-5V7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Archived: {new Date(asset.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleViewAsset(asset.id)}
                      disabled={verifyingId !== null || !hasPasskey}
                      className="text-xs font-mono uppercase tracking-wider text-white hover:text-neutral-300 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifyingId === asset.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        <>👁️ View Document</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </FadeIn>
      </div>

      {/* Decrypted Asset Preview Modal */}
      {verifiedAsset && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-50 backdrop-blur-md">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest font-semibold">Decrypted</span>
                <h3 className="text-lg font-medium text-white/95">{verifiedAsset.title}</h3>
              </div>
              <button 
                onClick={() => setVerifiedAsset(null)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded bg-black border border-white/5 p-4 flex items-center justify-center min-h-[300px]">
              {verifiedAsset.secureUrl.startsWith("data:image/") ? (
                <img 
                  src={verifiedAsset.secureUrl} 
                  alt={verifiedAsset.title} 
                  className="max-h-[50vh] object-contain rounded"
                />
              ) : verifiedAsset.secureUrl.startsWith("data:application/pdf") ? (
                <iframe 
                  src={verifiedAsset.secureUrl} 
                  className="w-full h-[50vh] border-0 rounded"
                />
              ) : (
                <div className="text-center space-y-4">
                  <svg className="w-12 h-12 text-muted-foreground mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-white/90">Decrypted document is ready for download.</p>
                    <p className="text-xs text-muted-foreground mt-1">This format cannot be previewed inline.</p>
                  </div>
                  <a 
                    href={verifiedAsset.secureUrl} 
                    download={verifiedAsset.title}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded hover:bg-neutral-200 transition-all text-xs uppercase font-mono"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download File
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Cryptographically verified via WebAuthn</span>
              <span>Audit action logged: SUCCESS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
