import { Component } from "react"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: "" }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught:", error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" })
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          padding: "24px"
        }}>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "32px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text3)", marginBottom: "24px" }}>
              {this.state.message || "An unexpected error occurred."}
            </p>
            <button onClick={this.handleReset} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Go to Login
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
