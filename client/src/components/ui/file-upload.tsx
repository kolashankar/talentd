import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, File, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  className?: string;
  multiple?: boolean;
  'data-testid'?: string;
}

export function FileUpload({
  onFileSelect,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.json', '.jpg', '.jpeg', '.png'],
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  multiple = false,
  'data-testid': testId,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(fileExtension)) {
      return `File type must be one of: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Take first file even in multiple mode for this component
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  return (
    <div className={cn("w-full", className)} data-testid={testId}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all file-upload-area",
          isDragOver ? "border-primary bg-muted drag-over" : "border-border hover:border-primary hover:bg-muted",
          error ? "border-destructive" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        data-testid={`${testId}-dropzone`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          onChange={handleInputChange}
          data-testid={`${testId}-input`}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
            <Upload className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2" data-testid={`${testId}-title`}>
              Drop your file here, or click to browse
            </h3>
            <p className="text-muted-foreground text-sm" data-testid={`${testId}-subtitle`}>
              Supports: {acceptedTypes.join(', ')} • Max {(maxSize / 1024 / 1024).toFixed(1)}MB
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <File className="h-4 w-4" />
            <span>PDF, DOC, DOCX files only</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-destructive text-sm" data-testid={`${testId}-error`}>
          <X className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
