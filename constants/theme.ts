// Configuração centralizada da paleta de cores do aplicativo (Design System)
export const COLORS = {
  primary: '#4F46E5',    // Cor primária (Indigo) usada em botões principais e destaques
  secondary: '#6366F1',  // Cor secundária de apoio
  background: '#F8FAFC', // Cor de fundo das telas
  card: '#FFFFFF',       // Cor de fundo para cartões e containers internos
  success: '#22C55E',    // Verde para indicar acertos e respostas corretas
  error: '#EF4444',      // Vermelho para indicar erros e respostas incorretas
  text: {
    primary: '#0F172A',   // Cor do texto principal (quase preto)
    secondary: '#475569', // Cor do texto de apoio ou descrições (cinza escuro)
    light: '#64748B',     // Cor do texto secundário suave (cinza médio)
    white: '#FFFFFF',     // Cor do texto branco
  },
  border: '#E2E8F0',     // Cor das bordas e divisórias do app
  shadow: 'rgba(79, 70, 229, 0.1)', // Cor de sombra dos componentes (efeito blur)
};

// Escala padrão de espaçamentos para paddings e margins de layouts consistentes
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Escala de raios de borda (arredondamento de cantos) para os componentes
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 9999, // Arredondamento completo (para avatares, barras cilíndricas, etc.)
};

// Mapeamento dos nomes de fontes customizadas do Google Fonts carregadas no app
export const FONTS = {
  bold: 'Outfit-Bold',
  medium: 'Outfit-Medium',
  regular: 'Outfit-Regular',
};

