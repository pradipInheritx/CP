import styled from "styled-components";
import {
  InputAndButton,
  PoppinsMediumBlack12px,
  PoppinsMediumBlackRock22px,
  PoppinsNormalChicago12px,
} from "../../styledMixins";
import { Form } from "react-bootstrap";

const Title = styled.div`
  ${PoppinsMediumBlackRock22px};
  min-height: 33px;
  align-self: center;
  margin-right: 7px;
  min-width: 61px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: capitalize;
  color: var(--blue-violet);
  text-align: center;
  font-size:22px;
  font-weight:400;
  margin-bottom:5px;
  margin-top:60px;
`;

export const Input = styled(Form.Control)`
  ${InputAndButton};
  ${PoppinsNormalChicago12px};
  min-width: ${(props) => (props.fullWidth ? "100%" : "0")};
  width: 100%;
  min-height: 19px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  margin: 0;
  padding: 8.1px 20px;
`;
// ${PoppinsNormalChicago12px; changes p tag according to new design
const p = styled.p`

  ${PoppinsMediumBlack12px};
  text-align: center;
  letter-spacing: 0;
  line-height: 13px;
`;

const Styles = {
  Title,
  p,
};

export default Styles;
