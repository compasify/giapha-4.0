// Next.js instrumentation — runs once when server starts
// Node.js-specific code tách sang instrumentation.node.ts
// để tránh Turbopack Edge Runtime static analysis warnings
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { registerNodeInstrumentation } = await import('./instrumentation.node')
        await registerNodeInstrumentation()
    }
}
