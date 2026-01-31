export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only run on the server side
    console.log('🐳 [Instrumentation] Starting Whale Worker in background...');
    
    // Fire and forget the worker script logic
    // We import it dynamically to avoid blocking the main thread during build
    import('./scripts/whale-worker').then(module => {
      module.startWorker().catch(err => {
        console.error('❌ [Instrumentation] Worker crashed:', err);
      });
    }).catch(err => {
      console.error('❌ [Instrumentation] Failed to load worker module:', err);
    });
  }
}
