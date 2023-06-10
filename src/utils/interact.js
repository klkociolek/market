import nofile from '../assets/nofile.png';

export const handleImageError = (event) => {
  event.target.src = nofile;
};

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "Connected",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "Not connected " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: "Install Metamask",
      };
    }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Connected",
        };
      } else {
        return {
          address: "",
          status: "Not connected",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "Install Metamask",
    };
  }
};