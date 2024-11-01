const proyectHeaders = ['codigo', 'ip', 'titulo', 'financiado', 'inicio', 'fin'];
const MATCH_SEMICOLOMNS_OUTSIDE_DOUBLE_QUOTES_REGEXP = /;(?=(?:(?:[^"]*"[^"]*")*[^"]*$))/;

const parseLine = (lines: string[]) => {
  const relevantLines: string[][] = [];
  let foundHeader = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!foundHeader && trimmedLine.startsWith('Código')) {
        foundHeader = true;
        relevantLines.push(proyectHeaders);
    } else if (foundHeader && trimmedLine && !trimmedLine.includes(';;;')) {
        relevantLines.push(trimmedLine.split(MATCH_SEMICOLOMNS_OUTSIDE_DOUBLE_QUOTES_REGEXP));
    }
  }
  return relevantLines;
}

const mapLines = (headers: string[], rows: string[][]) => {
  const result = [];

    for (const row of rows) {
      const proyecto: any = {};
      headers.forEach(
        (header, index) => 
            proyecto[header] = row[index].startsWith('"') 
                ? row[index].slice(1, -1) 
                : row[index]);

      result.push(proyecto);
    }
  return result;
}

export const processProyectoLines = (lines: string[]) => {
    const [headers, ...rows] = parseLine(lines);
    const result = mapLines(headers, rows);
    
    return result;
  }