import LoginForm from "@/components/LoginForm"
import { FadeIn } from "@/components/AnimatedUI"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-md space-y-12">
        <div className="space-y-4 text-center">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight">Portal</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-muted-foreground">Premium minimalist secure authentication.</p>
          </FadeIn>
        </div>
        
        <LoginForm />
      </div>
    </main>
  )
}
