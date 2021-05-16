import React from "react";
import { Container } from "theme-ui";
import { SystemStats } from "../components/SystemStats";
import CSS from 'csstype';

export const Swap: React.FC = () => {

  const uniStyle: CSS.Properties = {
    border: 0,
    margin: '0 auto',
    display: 'block',
    maxWidth: '600px',
    minWidth: '300px',
    borderRadius: '15px',
  };

  return (
    <Container variant="columns">
      <Container variant="left">
        <iframe
            src="https://app.uniswap.org/#/swap?inputCurrency=0x5f98805a4e8be255a32880fdec7f6728c6568ba0&outputCurrency=ETH"
            height="660px"
            width="100%"
            style={uniStyle}
            id="uniswap"
            title="uniswap"
        />
      </Container>

      <Container variant="right">
        <SystemStats />
      </Container>
    </Container>
  );
};