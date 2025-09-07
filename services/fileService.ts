

export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = (error) => {
        reject(new Error('Failed to read file: ' + error));
      };
      reader.readAsText(file);
    } else {
      reject(new Error(`File type not supported for analysis: ${file.type}. Please upload a .txt file.`));
    }
  });
}
