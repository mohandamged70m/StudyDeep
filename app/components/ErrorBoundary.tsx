"use client";

import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
          <AlertTriangle className="mb-3 h-8 w-8 text-rose-500" />
          <h3 className="text-sm font-bold text-white font-arabic mb-1">
            {this.props.fallbackTitle || 'حدث خطأ غير متوقع'}
          </h3>
          <p className="mb-4 text-[11px] text-zinc-400 font-arabic">
            حاول إعادة تحميل المكون أو تواصل مع الدعم لو المشكلة استمرت.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-4 py-2 text-[11px] font-semibold text-rose-400 transition-all hover:bg-rose-500/20 cursor-pointer font-arabic"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            إعادة المحاولة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
