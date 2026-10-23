export async function downloadProjectZip() {
  const zipPaths = [
    '/Nouriva-Health-Nutrition-AI-Final.zip',
    '/nouriva-team-project.zip',
    '/nouriva-standalone-complete.zip'
  ];

  for (const path of zipPaths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Nouriva-Health-Nutrition-AI-Project.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        return true;
      }
    } catch (e) {
      console.warn(`Failed downloading from ${path}, trying fallback`, e);
    }
  }

  // Fallback: direct browser navigation to zip link
  const link = document.createElement('a');
  link.href = '/Nouriva-Health-Nutrition-AI-Final.zip';
  link.setAttribute('download', 'Nouriva-Health-Nutrition-AI-Project.zip');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}
