import styled from 'styled-components';

export const Title = styled('h1')<{ size?: string }>`
  font-size: ${({ size }) => size || '24px'};
  color: ${({ color }) => color || '#000'};
`;
export const Description = styled('span')<{ size?: string }>`
  font-size: ${({ size }) => size || '16px'};
  color: ${({ color }) => color || '#000'};
`;
