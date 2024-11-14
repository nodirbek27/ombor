import styled from "styled-components";

const Container = styled.div`
  background-color: white;
  height: 60px;
  padding: 0 16px 0 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

// right navbar / time wrapper
const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  height: 100%;
  gap: 16px;
`;


export { Container, Section };
