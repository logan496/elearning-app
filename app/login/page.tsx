"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useState } from "react"
import { useI18n } from "@/lib/i18n-context"

export default function LoginPage() {
  const { t } = useI18n()
  const [isLogin, setIsLogin] = useState(true)

  return (
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 pb-20 px-4 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Info */}
              <div className="order-2 lg:order-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                  {isLogin ? t.login.title : t.login.signupTitle} <span className="text-primary">EduLearn</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {isLogin ? t.login.subtitle : t.login.signupSubtitle}
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-200">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                      <span className="text-primary font-bold text-lg">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{t.login.steps.step1.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{t.login.steps.step1.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-200">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                      <span className="text-primary font-bold text-lg">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{t.login.steps.step2.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{t.login.steps.step2.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-200">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                      <span className="text-primary font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{t.login.steps.step3.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{t.login.steps.step3.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="order-1 lg:order-2">
                <Card className="border-2 hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">
                      {isLogin ? t.login.signin : t.login.signupTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      {!isLogin && (
                          <div className="space-y-2">
                            <Label htmlFor="name">{t.login.name}</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Jean Dupont"
                                required
                                className="focus:scale-[1.01] transition-transform duration-200"
                            />
                          </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email">{t.login.email}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="vous@exemple.fr"
                            required
                            className="focus:scale-[1.01] transition-transform duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">{t.login.password}</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="focus:scale-[1.01] transition-transform duration-200"
                        />
                      </div>

                      {!isLogin && (
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">{t.login.confirmPassword}</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="focus:scale-[1.01] transition-transform duration-200"
                            />
                          </div>
                      )}

                      {isLogin && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="remember" />
                              <label
                                  htmlFor="remember"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {t.login.remember}
                              </label>
                            </div>
                            <Link href="#" className="text-sm text-primary hover:underline">
                              {t.login.forgot}
                            </Link>
                          </div>
                      )}

                      <Button
                          type="submit"
                          className="w-full hover:scale-105 transition-transform duration-200 hover:shadow-lg"
                          size="lg"
                      >
                        {isLogin ? t.login.signin : t.login.createAccount}
                      </Button>

                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">{t.login.or}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            className="hover:scale-105 transition-transform duration-200 hover:border-primary bg-transparent"
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Google
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            className="hover:scale-105 transition-transform duration-200 hover:border-primary bg-transparent"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                          </svg>
                          GitHub
                        </Button>
                      </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                      {isLogin ? (
                          <p className="text-muted-foreground">
                            {t.login.noAccount}{" "}
                            <button
                                onClick={() => setIsLogin(false)}
                                className="text-primary font-semibold hover:underline"
                            >
                              {t.login.signup}
                            </button>
                          </p>
                      ) : (
                          <p className="text-muted-foreground">
                            {t.login.hasAccount}{" "}
                            <button onClick={() => setIsLogin(true)} className="text-primary font-semibold hover:underline">
                              {t.login.signin}
                            </button>
                          </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
