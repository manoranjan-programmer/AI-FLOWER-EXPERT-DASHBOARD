/**
 * exporter.js
 * Utility functions for exporting tabular analytics data to CSV, Excel, and PDF formats.
 */

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export as CSV
export function exportToCSV(data, filename = 'analytics_report.csv') {
  if (!data || data.length === 0) return;
  
  // Format items (strip nested arrays/objects for CSV clarity)
  const cleanData = data.map(item => {
    const obj = {};
    Object.keys(item).forEach(key => {
      if (typeof item[key] !== 'object' || item[key] === null) {
        obj[key] = item[key];
      } else {
        obj[key] = JSON.stringify(item[key]);
      }
    });
    return obj;
  });

  const csv = Papa.unparse(cleanData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export as Excel (.xlsx)
export function exportToExcel(data, sheetName = 'Analytics Data', filename = 'analytics_report.xlsx') {
  if (!data || data.length === 0) return;

  const cleanData = data.map(item => {
    const obj = {};
    Object.keys(item).forEach(key => {
      if (typeof item[key] !== 'object' || item[key] === null) {
        obj[key] = item[key];
      }
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}

// Export as PDF
export function exportToPDF(columns, data, title = 'Analytics Report', filename = 'analytics_report.pdf') {
  if (!data || data.length === 0) return;

  const doc = new jsPDF('l', 'mm', 'a4');
  
  // PDF Header
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129); // Brand emerald
  doc.text('AI Flower Expert - Admin Analytics', 14, 15);

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text(`${title} - Generated ${new Date().toLocaleString()}`, 14, 22);

  // Table Body Rows
  const tableRows = data.map(row => columns.map(col => {
    const val = row[col.accessor];
    return val !== undefined && val !== null ? String(val) : '';
  }));

  const tableHeaders = columns.map(col => col.header);

  doc.autoTable({
    head: [tableHeaders],
    body: tableRows,
    startY: 28,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [19, 27, 46], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(filename);
}
