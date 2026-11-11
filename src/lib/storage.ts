import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Pastikan folder public/uploads selalu ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface SaveFileResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export async function saveFile(
  file: File,
  allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSizeBytes = 5 * 1024 * 1024 // 5 MB
): Promise<SaveFileResult> {
  try {
    if (!allowedMimeTypes.includes(file.type)) {
      return {
        success: false,
        error: `Format file tidak didukung (${file.type}). Hanya diperbolehkan JPG, PNG, atau WebP.`,
      };
    }

    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Maksimal 5 MB.",
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "jpg"}`;
    const safeName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const targetPath = path.join(UPLOAD_DIR, safeName);

    await fs.promises.writeFile(targetPath, buffer);

    return {
      success: true,
      filePath: `/uploads/${safeName}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Gagal menyimpan file: ${err.message}`,
    };
  }
}

export async function deleteFile(relativeFilePath: string): Promise<boolean> {
  try {
    if (!relativeFilePath.startsWith("/uploads/")) {
      return false; // Jangan sentuh file di luar uploads
    }

    const fileName = path.basename(relativeFilePath);
    const targetPath = path.join(UPLOAD_DIR, fileName);

    if (fs.existsSync(targetPath)) {
      await fs.promises.unlink(targetPath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

