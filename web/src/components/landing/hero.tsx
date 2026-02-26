'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-40 md:pb-48">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[128px]" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-[128px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>AI-Powered Travel Planning</span>
          </div>

          <h1 className="mb-8 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
            Plan Your <span className="text-primary">Perfect Trip</span> <br />
            in Seconds with AI
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Experience the future of travel. Personalized itineraries, smart budgeting, and automated booking—all in one place.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base">
              Start Planning Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              See How It Works
            </Button>
          </div>
        </motion.div>

        {/* Visual Element / Placeholder for Map or 3D Globe */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl rounded-xl border bg-background/50 p-2 shadow-2xl backdrop-blur-sm"
        >
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted/50">
            {/* Abstract Map UI representation */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
              <div className="text-center">
                <MapPin className="mx-auto h-16 w-16 mb-4 opacity-20" />
                <p className="text-sm font-medium">Interactive Map Preview</p>
              </div>
            </div>

            {/* Floating Cards (Decorative) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-64 rounded-lg border bg-card p-4 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">🗼</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Paris, France</p>
                  <p className="text-xs text-muted-foreground">3 Day Itinerary</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded-full bg-muted"></div>
                <div className="h-2 w-1/2 rounded-full bg-muted"></div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 left-10 w-56 rounded-lg border bg-card p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Total Budget</p>
                <span className="text-sm font-bold text-green-500">$1,250</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full w-2/3 bg-primary"></div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
