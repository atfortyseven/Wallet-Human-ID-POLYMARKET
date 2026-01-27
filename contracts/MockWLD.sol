// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockWLD is ERC20 {
    constructor() ERC20("Worldcoin Token", "WLD") {
        _mint(msg.sender, 1000000 * 10**18); 
    }

    // Faucet público: Regala 10 WLD a quien lo pida
    function faucet() external {
        _mint(msg.sender, 10 * 10**18);
    }
}
