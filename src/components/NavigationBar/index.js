import React, { useEffect,useState }  from 'react';
import {
  Nav,
  NavLink,
  NavMenuAcc,
  NavMenuList,
  NavMenuLogo,
  Logo,
  Button
} from '../../elements';
import LogoElectr from '../../assets/ee.png';
import {
  getCurrentWalletConnected,
  connectWallet
} from "../../utils/interact.js";
  
const NavigationBar = () => {

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    wallet_update();
  }, []);

  async function wallet_update() {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWallet(walletResponse.address);
  };

  return (
    <>
      <Nav>
        <NavMenuLogo>
          <Logo src={LogoElectr}/>
        </NavMenuLogo>
        <NavMenuList>
          <NavLink to='/discover' activeStyle>
            Discover
          </NavLink>
          <NavLink to='/mint' activeStyle>
            Create
          </NavLink>
          <NavLink to='/profile' activeStyle>
            Profile
          </NavLink>
        </NavMenuList>
        <NavMenuAcc>
          <Button id="walletButton" onClick={connectWalletPressed}>
            {walletAddress.length > 0 ? (
              "Connected"
            ) : (
              <span>Connect Wallet</span>
            )}
          </Button>
        </NavMenuAcc>
      </Nav>
    </>
  );
};
  
export default NavigationBar;

