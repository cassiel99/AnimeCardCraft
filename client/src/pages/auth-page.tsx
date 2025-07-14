import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect } from "react";

type LoginData = Pick<InsertUser, "username" | "password">;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "" },
  });

  const handleLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: InsertUser) => {
    registerMutation.mutate(data);
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold font-orbitron text-accent mb-2">
              Welcome to AnimeCards
            </h1>
            <p className="text-gray-300">Create your legendary anime card collection</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-card-bg">
              <TabsTrigger value="login" className="data-[state=active]:bg-accent data-[state=active]:text-dark-bg">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-accent data-[state=active]:text-dark-bg">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="bg-card-bg border-accent/30">
                <CardHeader>
                  <CardTitle className="text-accent">Sign In</CardTitle>
                  <CardDescription className="text-gray-300">
                    Enter your credentials to access your cards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username" className="text-gray-300">Username</Label>
                      <Input
                        id="login-username"
                        {...loginForm.register("username")}
                        className="bg-dark-bg border-accent/30 focus:border-accent text-white"
                        placeholder="Enter your username"
                      />
                      {loginForm.formState.errors.username && (
                        <p className="text-red-400 text-sm">{loginForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        {...loginForm.register("password")}
                        className="bg-dark-bg border-accent/30 focus:border-accent text-white"
                        placeholder="Enter your password"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-red-400 text-sm">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/80 text-dark-bg font-bold"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="bg-card-bg border-accent/30">
                <CardHeader>
                  <CardTitle className="text-accent">Create Account</CardTitle>
                  <CardDescription className="text-gray-300">
                    Join the anime card creators community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username" className="text-gray-300">Username</Label>
                      <Input
                        id="register-username"
                        {...registerForm.register("username")}
                        className="bg-dark-bg border-accent/30 focus:border-accent text-white"
                        placeholder="Choose a username"
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-red-400 text-sm">{registerForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-gray-300">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        {...registerForm.register("password")}
                        className="bg-dark-bg border-accent/30 focus:border-accent text-white"
                        placeholder="Create a password"
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-red-400 text-sm">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/80 text-dark-bg font-bold"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="flex-1 bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="text-6xl font-bold font-orbitron text-accent animate-glow">
            <i className="fas fa-magic mr-4"></i>
            AnimeCards
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Create Legendary Cards</h2>
            <p className="text-lg text-white/80 max-w-md mx-auto">
              Design your own anime characters with unique abilities, stats, and stunning artwork. 
              Build your collection and become a master card creator!
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 glass-effect">
              <i className="fas fa-users text-2xl text-accent mb-2"></i>
              <p className="text-sm text-white">Create Characters</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 glass-effect">
              <i className="fas fa-magic text-2xl text-accent mb-2"></i>
              <p className="text-sm text-white">Cast Spells</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 glass-effect">
              <i className="fas fa-gem text-2xl text-accent mb-2"></i>
              <p className="text-sm text-white">Collect Artifacts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
