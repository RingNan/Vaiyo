let currentAccount = null;
function post(path, params, method = "post") {
  // The rest of this code assumes you are not using a library.
  // It can be made less verbose if you use one.
  const form = document.createElement("form");
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

async function connectWithWallet(wallettype, where) {
  switch (wallettype) {
    case "metamask":
      await connectMetamask();
      break;
    case "binance":
      await connectBinance();
      break;
    case "mathwallet":
      await connectMathwallet();
      break;
    default:
    // code block
  }

  if (where == "signin") {
    post("/u/login/", { waddress: currentAccount });
  }
  if (where == "signup") {
    document.getElementById("txtwaddress").value = currentAccount;
  }
}
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    // Binance Chain Wallet is locked or the user has not connected any accounts
    console.log("Please connect to Binance Chain Wallet.");
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    // Do any other work!
  }
}

async function connectMetamask() {
  if (typeof window.ethereum !== "undefined") {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    handleAccountsChanged(accounts);
  }
}

// BinanceChain.on("chainChanged", handleChainChanged);

// function handleChainChanged(_chainId) {
//   // We recommend reloading the page, unless you must do otherwise
//   window.location.reload();
// }

async function connectBinance() {
  if (typeof window.BinanceChain !== "undefined") {
    const accounts = await BinanceChain.request({
      method: "eth_requestAccounts",
    });
    handleAccountsChanged(accounts);
  }
}

async function connectMathwallet() {
  if (typeof window.bitcoin !== "undefined") {
    var payload = await bitcoin.getAccount();
    var account = payload["address"];
  } else if (window.ethereum.isMathWallet) {
    var account = ethereum.selectedAddress;
  } else if (typeof window.solana !== "undefined") {
    // var account = solana.getAccount();
  } else if (typeof window.injectedWeb3.mathwallet !== "undefined") {
    // var account =
  }

  if (account) currentAccount = account;
}
