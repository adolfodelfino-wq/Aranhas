import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl mx-auto my-8 space-y-4 text-center">
          <div className="w-12 h-12 bg-amber-950/80 border border-amber-800 text-amber-400 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            {this.props.fallbackTitle || 'Ocorreu um erro temporário nesta exibição'}
          </h2>
          <p className="text-xs text-slate-400">
            {this.state.error?.message || 'Tente recarregar esta seção para continuar.'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl inline-flex items-center space-x-2 transition-colors shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recarregar Módulo</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
