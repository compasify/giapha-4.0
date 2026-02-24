use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;

fn spawn_sidecar(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    // appDataDir is OS-specific:
    //   macOS:   ~/Library/Application Support/vn.giaphaonline.app
    //   Linux:   ~/.local/share/vn.giaphaonline.app
    //   Windows: %APPDATA%\vn.giaphaonline.app
    let app_data_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to resolve app data directory");

    let data_dir = app_data_dir.join("data");
    std::fs::create_dir_all(&data_dir).expect("Failed to create data directory");

    let db_path = data_dir.join("family.db");
    let database_url = format!("file:{}", db_path.to_string_lossy());

    let resource_dir = app
        .path()
        .resolve("standalone", tauri::path::BaseDirectory::Resource)
        .expect("Failed to resolve standalone resource directory");
    let server_js = resource_dir.join("server.js");

    log::info!("Spawning sidecar: node {}", server_js.to_string_lossy());
    log::info!("DATABASE_URL: {}", database_url);

    // "node" matches the stem of externalBin entry "binaries/node"
    let (mut rx, _child) = app
        .shell()
        .sidecar("node")
        .expect("Failed to find node sidecar binary")
        .args([server_js.to_string_lossy().as_ref()])
        .env("DATA_MODE", "local")
        .env("DATABASE_URL", &database_url)
        .env("LOCAL_AUTH_DISABLED", "true")
        .env("PORT", "3000")
        .env("HOSTNAME", "127.0.0.1")
        .env("NODE_ENV", "production")
        .current_dir(&resource_dir)
        .spawn()
        .expect("Failed to spawn Next.js server sidecar");

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(bytes) => {
                    let line = String::from_utf8_lossy(&bytes);
                    log::info!("[nextjs] {}", line.trim());
                }
                CommandEvent::Stderr(bytes) => {
                    let line = String::from_utf8_lossy(&bytes);
                    log::warn!("[nextjs:err] {}", line.trim());
                }
                CommandEvent::Terminated(payload) => {
                    log::error!("[nextjs] terminated with code {:?}", payload.code);
                    break;
                }
                _ => {}
            }
        }
    });

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .setup(|app| {
            if !cfg!(debug_assertions) {
                if let Err(e) = spawn_sidecar(app) {
                    log::error!("Failed to spawn sidecar: {}", e);
                    return Err(e.into());
                }
            } else {
                log::info!("Dev mode — skipping sidecar spawn (beforeDevCommand handles it)");
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
