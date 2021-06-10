import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;

  h1 {
    text-align: center;
    margin: 7px;
  }
  span {
    margin: 5px 0;
  }
  input {
    margin: 5px 0;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
