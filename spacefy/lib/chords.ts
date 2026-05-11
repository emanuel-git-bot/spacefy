const scaleAmerican = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const scaleAmericanFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const scaleLatin = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];

/**
 * Transpõe um acorde básico em N semitons.
 * @param chord Acorde original (ex: C, Am, F#m7)
 * @param steps Quantidade de semitons (+1, -2, etc)
 * @param system Sistema desejado ('american' ou 'latin')
 */
export function transposeChord(chord: string, steps: number, system: 'american' | 'latin' = 'american'): string {
  if (!chord) return '';
  
  // Isola a raiz do acorde e os modificadores
  const match = chord.match(/^([A-G][b#]?|Dó[#]?|Ré[#]?|Mi|Fá[#]?|Sol[#]?|Lá[#]?|Si[b]?)(.*)$/i);
  if (!match) return chord; // Se não reconhecer, retorna como está

  const root = match[1];
  const modifier = match[2];

  // Encontra o índice da raiz na escala
  let index = -1;
  let currentScale = scaleAmerican;

  if (scaleAmerican.includes(root)) {
    index = scaleAmerican.indexOf(root);
  } else if (scaleAmericanFlat.includes(root)) {
    index = scaleAmericanFlat.indexOf(root);
  } else if (scaleLatin.includes(root)) {
    index = scaleLatin.indexOf(root);
    currentScale = scaleLatin;
  }

  if (index === -1) return chord;

  // Calcula novo índice (circular)
  let newIndex = (index + steps) % 12;
  if (newIndex < 0) newIndex += 12;

  // Seleciona a escala de saída
  const targetScale = system === 'latin' ? scaleLatin : scaleAmerican;
  const newRoot = targetScale[newIndex];

  return newRoot + modifier;
}
