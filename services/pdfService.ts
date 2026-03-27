
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { User, Ticket } from '@/types';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: object) => jsPDF;
  }
}

export const pdfService = {
  generateUserReport: (users: User[]) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('pt-BR');
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(24, 97, 148); // #186194
    doc.text('Relatório de Acessos e Permissões', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${date}`, 14, 30);
    
    // Table
    const tableData = users.map(user => [
      user.name,
      user.sector,
      user.email,
      user.username,
      user.role
    ]);
    
    doc.autoTable({
      startY: 40,
      head: [['Nome', 'Setor', 'E-mail', 'Login', 'Nível de Acesso']],
      body: tableData,
      headStyles: { fillColor: [24, 97, 148] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 40 },
    });
    
    doc.save(`relatorio-usuarios-${date.replace(/\//g, '-')}.pdf`);
  },

  generateTicketReport: (tickets: Ticket[], filters: { status?: string, priority?: string }) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('pt-BR');
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(24, 97, 148); // #186194
    doc.text('Relatório de Chamados Internos', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${date}`, 14, 30);
    
    // Filters info
    const filterText = `Filtros: Status: ${filters.status || 'Todos'} | Prioridade: ${filters.priority || 'Todas'}`;
    doc.text(filterText, 14, 36);
    
    // Table
    const tableData = tickets.map(ticket => [
      ticket.id.substring(0, 8),
      ticket.title,
      ticket.sector,
      ticket.priority,
      ticket.status,
      new Date(ticket.createdAt).toLocaleDateString('pt-BR')
    ]);
    
    doc.autoTable({
      startY: 45,
      head: [['ID', 'Título', 'Setor', 'Prioridade', 'Status', 'Data']],
      body: tableData,
      headStyles: { fillColor: [24, 97, 148] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 45 },
    });
    
    doc.save(`relatorio-chamados-${date.replace(/\//g, '-')}.pdf`);
  }
};
