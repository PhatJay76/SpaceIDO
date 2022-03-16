// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "./interfaces/IERC20.sol";

import "./types/Ownable.sol";
import "./types/ERC20.sol";

import "./libraries/SafeMath.sol";
import "./libraries/Math.sol";
import "./libraries/SafeERC20.sol";

contract SpaceIDO is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    event Contribute(address indexed buyer, uint256 amountInput, uint256 tokenOutput);

    IERC20 public SPACE;
    IERC20 public BUSD;
    
    address public DAO;

    uint256 public salePrice;
    uint256 public amountSold;
    uint256 public minAmount;
    uint256 public maxAmount;
    
    bool public initialized;
    bool public whiteListEnabled;
    bool public finalized;

    mapping(address => bool) public approvedContributors;
    mapping(address => bool) public contributed;
    mapping(address => uint256) public contributedAmounts;

    constructor() {}

    function initialize(
        address _SPACE,
        address _BUSD,
        address _DAO,
        uint256 _salePrice,
        uint256 _minAmount,
        uint256 _maxAmount,
        bool _whiteListEnabled
    ) external onlyOwner {
        require(!initialized, "Already initialized");
        require(_minAmount < _maxAmount, "Invalid amounts");
        require(_SPACE != address(0));
        require(_BUSD != address(0));
        require(_DAO != address(0));
        SPACE = IERC20(_SPACE);
        BUSD = IERC20(_BUSD);
        DAO = _DAO;
        salePrice = _salePrice;
        minAmount = _minAmount;
        maxAmount = _maxAmount;
        whiteListEnabled = _whiteListEnabled;
        initialized = true;
    }
    function _approveContributor(address newBuyer)
        internal
    {
        approvedContributors[newBuyer] = true;
    }
    function approveContributor(address newBuyer) external onlyOwner {
        _approveContributor(newBuyer);
    }
    function approveContributors(address[] calldata newContributors)
        external
        onlyOwner
    {
        for (uint256 i = 0; newContributors.length > i; i++) {
            _approveContributor(newContributors[i]);
        }
    }
    function contribute(uint256 contributionAmount) external {
        require(initialized, "Not started");
        require(!contributed[msg.sender], "Already contributed");
        if (whiteListEnabled) {
            require(approvedContributors[msg.sender], "Address not whitelisted");
        }
        require(contributionAmount >= minAmount, "Amount too low");
        require(contributionAmount <= maxAmount, "Amount too high");
        BUSD.safeTransferFrom(msg.sender, DAO, contributionAmount);
        uint256 tokensOutput = _quote(contributionAmount);
        contributedAmounts[msg.sender] = tokensOutput;
        contributed[msg.sender] = true;
        emit Contribute(msg.sender, contributionAmount, tokensOutput);
        amountSold += contributionAmount;
    }
    function claim() public {
        require(finalized, "Can only claim after sale is finalized");
        require(contributed[msg.sender], "Did not purchase");
        SPACE.safeTransfer(msg.sender, contributedAmounts[msg.sender]);
        contributedAmounts[msg.sender] = 0;
        contributed[msg.sender] = false;
    }
    function disableWhiteList() external onlyOwner {
        whiteListEnabled = false;
    }
    function finalize() external onlyOwner {
        require(!finalized, "Already finalized");
        uint256 tokensNeeded = _quote(amountSold);
        require(tokensNeeded == SPACE.balanceOf(address(this)), "Not enough SPACE in contract");
        finalized = true;
    }
    function getAmountSold() external view returns (uint) {
        return amountSold;
    }
    function _quote(uint256 amount)
        internal
        view
        returns (uint256)
    {
        return uint256(1e9).mul(amount).div(salePrice);
    }
    function quote(uint256 amount)
        external
        view
        returns (uint256)
    {
        return _quote(amount);
    }
    function withdrawTokens(address tokenToWithdraw)
        external
        onlyOwner
    {
        IERC20(tokenToWithdraw).safeTransfer(
            msg.sender,
            IERC20(tokenToWithdraw).balanceOf(address(this))
        );
    }
}
