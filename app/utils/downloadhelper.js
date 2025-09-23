import jsPDF from 'jspdf';

export const downloadNotePDF = (note, noteType, formatDate, formatTime) => {
  if (!note) return;
  
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text(`${noteType.toUpperCase()} NOTE`, 20, 25);
  
  // Title
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(note.title, 20, 40);
  
  // Reset font
  doc.setFont(undefined, 'normal');
  doc.setFontSize(12);
  
  // Author
  const authorText = note.creator 
    ? `${noteType === 'nurse' ? 'Nurse' : 'Dr.'} ${note.creator.firstName} ${note.creator.lastName}` 
    : 'Unknown';
  doc.text(`Author: ${authorText}`, 20, 55);
  
  // Date and Time
  doc.text(`Date: ${formatDate(note.createdAt)}`, 20, 65);
  doc.text(`Time: ${formatTime(note.createdAt)}`, 20, 75);
  
  // Tags
  const tagsText = note.tags && note.tags.length > 0 ? note.tags.join(', ') : 'None';
  doc.text(`Tags: ${tagsText}`, 20, 85);
  
  // Line separator
  doc.line(20, 95, 190, 95);
  
  // Content header
  doc.setFont(undefined, 'bold');
  doc.text('Content:', 20, 110);
  
  // Content body
  doc.setFont(undefined, 'normal');
  const content = note.content || note.body || 'No content available';
  const splitContent = doc.splitTextToSize(content, 170);
  doc.text(splitContent, 20, 125);
  
  // Generate filename
  const fileName = `${noteType}-note-${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Save the PDF
  doc.save(fileName);
};