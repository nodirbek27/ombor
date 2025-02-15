import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  /* border: 2px solid coral; */
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
  gap: 16px;
`;

const Timer = styled.div`
  color: ${({ status }) =>
    status ? "var(--secondaryColor)" : "var(--primaryColor)"};
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  /* padding: 2px; */
  /* width: 80px; */
  /* border: 1px solid red; */
`;

export { Container, Section, Timer };
