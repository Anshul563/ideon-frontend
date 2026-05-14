import { ReactNode } from "react";

export type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  plan?: string;
  tokensLeft?: number;
  profilePic?: string;
};

export type ScoreMap = Record<string, number>;

export type Competitor = {
  name?: string;
  website?: string;
  description?: string;
  weakness?: string;
};

export type Improvement = {
  feature?: string;
  description?: string;
};

export type BetterVersion = {
  name?: string;
  description?: string;
};

export type RiskItem = {
  title?: string;
  description?: string;
};

export type RoastItem = {
  point?: string;
  comment?: string;
};

export type AnalysisResult = {
  scoring?: {
    scores?: ScoreMap;
    verdict?: string;
    reason?: string;
    totalScore?: number;
    score?: number;
  };
  expanded?: {
    expanded_idea?: string;
    core_problem?: string;
    target_users?: string;
  };
  market?: {
    demand_level?: string;
    reason?: string;
  };
  competitors?: Competitor[];
  improvements?: {
    improvements?: Improvement[];
    better_versions?: BetterVersion[];
  };
  failure_reasons?: RiskItem[];
  market_risks?: RiskItem[];
  execution_challenges?: RiskItem[];
  roasts?: RoastItem[];
  brutal_verdict?: string;
  the_burn?: string;
  architecture?: {
    tech_stack: string[];
    architecture: {
      nodes: any[];
      edges: any[];
    };
    estimated_monthly_cost?: string;
    security_score?: number;
    scalability_strategy?: string;
    security_recommendations?: string[];
  };
  result?: AnalysisResult;
};

export type IdeaRecord = {
  id: string;
  idea?: string;
  createdAt: string;
  mode?: "full" | "stress" | "roast" | string;
  result?: AnalysisResult;
};

export type AnalyticsData = {
  total: number;
  avgScore?: number;
  verdicts: Array<{
    verdict?: string;
    count: number;
  }>;
};

export type TrendItem = {
  growth: ReactNode;
  score: number;
  title: ReactNode;
  platform?: string;
  tags?: string[];
  name?: string;
  description?: string;
  gap?: string;
  link?: string;
};

export type PaymentVerification = {
  verified?: boolean;
  planId?: string;
  orderId?: string;
};
