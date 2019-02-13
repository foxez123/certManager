App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // add something
    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    //alert("initContract");
    $.getJSON('CertManager.json', function (data) {
      //console.log("TEST001");
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var CertManagerArtifact = data;
      App.contracts.CertManager = TruffleContract(CertManagerArtifact);

      // Set the provider for our contract
      App.contracts.CertManager.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      //return App.markAdopted();
    });

    return App.bindEvents();
  },

  setSample1: function(sampleType) {
    //alert(data-id.val());
    //var sampleType = "s0";
    var certTypeId, certTypeNm, issuerNm, descUrl;
    if( sampleType == "s0" ) {
      certTypeId = "", certTypeNm = "", issuerNm = "", descUrl = "";
    } else if( sampleType == "s1" ) {
      certTypeId = "CT001", certTypeNm = "Blockchain Proficiency", issuerNm = "Consensys Academy", descUrl = "https://consensys.net/academy/";
    } else if( sampleType == "s2" ) {
      certTypeId = "CT002", certTypeNm = "AWS Cloud Certificate", issuerNm = "AWS", descUrl = "https://aws.amazon.com/certification/?nc1=h_ls";
    } else if( sampleType == "s3" ) {
      certTypeId = "CT003", certTypeNm = "AWS CA Certificate", issuerNm = "AWS", descUrl = "https://aws.amazon.com/certification/?nc1=h_ls";
    }

    $('#certTypeId').val(certTypeId);
    $('#certTypeNm').val(certTypeNm);
    $('#issuerNm').val(issuerNm);
    $('#descUrl').val(descUrl);
  },

  setSample2: function(certTypeId) {
    $('#in-certTypeId').val(certTypeId);

    $('#certTypeNm').val("");
    $('#issuerNm').val("");
    $('#descUrl').val("");
    $('#isValid').val("");
  },

  setSample3: function(sampleType) {
    var certId, certNo, issueDt, validThroughDt, certTypeId;
    if( sampleType == "s0" ) {
      certId = "", certNo = "", issueDt = "", validThroughDt = "", certTypeId = ""
    } else if( sampleType == "s1" ) {
      certId = "1", certNo = "Blockchain001", issueDt = "2019-01-01", validThroughDt = "2022-01-01", certTypeId = "CT001";
    } else if( sampleType == "s2" ) {
      certId = "2", certNo = "AWS_CLOUD22", issueDt = "2019-02-02", validThroughDt = "2029-02-01", certTypeId = "CT002";
    } else if( sampleType == "s3" ) {
      certId = "3", certNo = "AWS_CA_3333", issueDt = "2019-03-03", validThroughDt = "2099-12-31", certTypeId = "CT003";
    }

    $('#certId').val(certId);
    $('#certNo').val(certNo);
    $('#issueDt').val(issueDt);
    $('#validThroughDt').val(validThroughDt);
    $('#certTypeId').val(certTypeId);
  },

  setSample4: function(certId) {
    $('#in-certId').val(certId);

    $('#certTypeNm').val("");
    $('#issuerNm').val("");
    $('#descUrl').val("");
    $('#certNo').val("");
    $('#issueDt').val("");
    $('#validThroughDt').val("");
  },

  setSample5: function(sampleType) {
    var tokenId, certId, validDays;
    if( sampleType == "s0" ) {
      tokenId = "", certId = "", validDays = "";
    } else if( sampleType == "s1" ) {
      tokenId = "ABCDEF1", certId = "1", validDays = "365";
    } else if( sampleType == "s2" ) {
      tokenId = "1234561", certId = "1", validDays = "0";
    } else if( sampleType == "s3" ) {
      tokenId = "!@#123ABC1", certId = "2", validDays = "31";
    }

    $('#tokenId').val(tokenId);
    $('#certId').val(certId);
    $('#validDays').val(validDays);
  },

  setSample6: function(tokenId) {
    $('#in-tokenId').val(tokenId);

    $('#certTypeNm').val("");
    $('#issuerNm').val("");
    $('#descUrl').val("");
    $('#certNo').val("");
    $('#issueDt').val("");
    $('#validThroughDt').val("");
  },

  bindEvents: function () {
    $(document).on('click', '.btn-link1',    App.handle1RegisterCertType);
    $(document).on('click', '.btn-link2',    App.handle2ViewCertTypeInfo);
    $(document).on('click', '.btn-link3',    App.handle3RegisterPersonalCert);
    $(document).on('click', '.btn-link4-1',  App.handle41ViewPersonalCertByCertId);
    $(document).on('click', '.btn-link4-2',  App.handle42ConfirmPersonalCert);
    $(document).on('click', '.btn-link5',    App.handle5RegisterCertToken);
    $(document).on('click', '.btn-link6',    App.handle6ViewPersonalCertByToken);
  },


  handle1RegisterCertType: function (event) {
    //alert('handle1RegisterCertType');
    event.preventDefault();

    var certTypeId = $('#certTypeId').val();
    var certTypeNm = $('#certTypeNm').val();
    var issuerNm = $('#issuerNm').val();
    var descUrl = $('#descUrl').val();

    var certManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.CertManager.deployed().then(function (instance) {
        certManagerInstance = instance;

        return certManagerInstance.registerCertType(certTypeId, certTypeNm, issuerNm, descUrl, {from: account});
      }).then(function (result) {
        //alert("result:" + result);

      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handle2ViewCertTypeInfo: function (event) {
    //alert('handle2ViewCertTypeInfo');
    event.preventDefault();

    var certTypeId = $('#in-certTypeId').val();
    var certManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.CertManager.deployed().then(function (instance) {
        certManagerInstance = instance;
        return certManagerInstance.viewCertTypeInfo(certTypeId, {from: account});
      }).then(function (certTypeInfo) {
        //alert("result:" + certTypeInfo);

        $('#certTypeNm').val(certTypeInfo[0]);
        $('#issuerNm').val(certTypeInfo[1]);
        $('#descUrl').val(certTypeInfo[2]);
        if( certTypeInfo[0] != "" ) {
          $('#isValid').val(certTypeInfo[3]);
        } else {
          $('#isValid').val("");
        }
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handle3RegisterPersonalCert: function (event) {
   //alert('handleRegisterPersonalCert');
    event.preventDefault();

    var certId = $('#certId').val();
    var issueDt = $('#issueDt').val();
    var validThroughDt = $('#validThroughDt').val();
    var certNo = $('#certNo').val();
    var certTypeId = $('#certTypeId').val();

    //alert(certId + "|" + issueDt + "|" + validThroughDt + "|" + certNo + "|" + certTypeId);
    var certManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.CertManager.deployed().then(function (instance) {
        //alert('CertManager.deployed()');
        certManagerInstance = instance;

        return certManagerInstance.registerPersonalCert(certId, issueDt, validThroughDt, certNo, certTypeId, {from: account, gas: 3000000, value: 1000000000000000000});
      }).then(function (result) {
        //alert("result" + JSON.stringify(result));

      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handle41ViewPersonalCertByCertId: function (event) {
    //alert("handle41ViewPersonalCertByCertId");
    event.preventDefault();

    var certId = $('#in-certId').val();
    //alert("certId:" + certId);
    var certManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.CertManager.deployed().then(function (instance) {
        certManagerInstance = instance;
        return certManagerInstance.viewPersonalCertByCertId(certId, {from: account});
      }).then(function (certInfo) {
        //alert("result:" + certInfo);
        $('#certTypeNm').val(certInfo[0]);
        $('#issuerNm').val(certInfo[1]);
        $('#descUrl').val(certInfo[2]);
        $('#certNo').val(certInfo[3]);
        $('#issueDt').val(certInfo[4]);
        $('#validThroughDt').val(certInfo[5]);
        $('#isConfirmed').val(certInfo[6]);

      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handle42ConfirmPersonalCert: function (event) {
    //alert("handle42ConfirmPersonalCert");
    event.preventDefault();

    var certId = $('#in-certId').val();
    //alert("certId:" + certId);
    var certManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.CertManager.deployed().then(function (instance) {
        certManagerInstance = instance;
        return certManagerInstance.confirmPersonalCert(certId, {from: account});
      }).then(function (result) {
        //alert("EEE");
        return App.handle41ViewPersonalCertByCertId(event);

      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handle5RegisterCertToken: function (event) {
    //alert('handle1RegisterCertType');
    event.preventDefault();

    var tokenId = $('#tokenId').val();
    var certId = $('#certId').val();
    var validDays = $('#validDays').val();

    var certManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.CertManager.deployed().then(function (instance) {
        certManagerInstance = instance;

        return certManagerInstance.registerCertToken(tokenId, certId, validDays, {from: account});
      }).then(function (result) {
        //alert("result:" + JSON.stringify(result));

      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handle6ViewPersonalCertByToken: function (event) {
    //alert("handle6ViewPersonalCert");
    event.preventDefault();

    var tokenId = $('#in-tokenId').val();
    //alert("certId:" + certId);
    var certManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.CertManager.deployed().then(function (instance) {
        certManagerInstance = instance;
        return certManagerInstance.viewPersonalCertByToken(tokenId, {from: account});
      }).then(function (certInfo) {
        //alert("result:" + certInfo);
        $('#certTypeNm').val(certInfo[0]);
        $('#issuerNm').val(certInfo[1]);
        $('#descUrl').val(certInfo[2]);
        $('#certNo').val(certInfo[3]);
        $('#issueDt').val(certInfo[4]);
        $('#validThroughDt').val(certInfo[5]);

      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
