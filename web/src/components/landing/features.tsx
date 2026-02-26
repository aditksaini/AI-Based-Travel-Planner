'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Wallet, Map, RefreshCw, Users, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'AI Smart Planning',
    description: 'Our AI creates personalized day-by-day itineraries based on your interests and pace.',
    icon: Bot,
  },
  {
    title: 'Budget Management',
    description: 'Track expenses in real-time and get alerts if you exceed your planned budget.',
    icon: Wallet,
  },
  {
    title: 'Interactive Maps',
    description: 'Visualize your trip with optimized routes to save travel time between locations.',
    icon: Map,
  },
  {
    title: 'Instant Re-planning',
    description: 'Change plans on the fly. The AI adjusts your schedule instantly without rebuilding everything.',
    icon: RefreshCw,
  },
  {
    title: 'Public Opinions',
    description: 'Get summarized pros and cons from real traveler reviews to spot hidden gems.',
    icon: Users,
  },
  {
    title: 'Safety Insights',
    description: 'Stay safe with real-time alerts about tourist scams and local safety precautions.',
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section className="container mx-auto px-4 py-24 md:py-32">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
          Everything You Need for the <span className="text-primary">Perfect Trip</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Powerful features designed to make travel planning effortless and enjoyable.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="border-none bg-secondary/50 shadow-sm transition-all hover:bg-secondary hover:shadow-md">
            <CardHeader>
              <feature.icon className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
