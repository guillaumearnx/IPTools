'use strict';

let isIP = (ipaddress) => {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress);
}

let ipvalue, iplength, sendButton;

//values
let pIP, pMask, pNetwork, pBroadcast, pFirst, pLast, pNb, nbHost, wanted, subnet, mSubnet;

let parse = (ip) => {
    let s = ""
    if (ip.length === 32) {
        for (let i = 1; i <= 32; i++) {
            s += ip.substring(i - 1, i)
            if (i !== 1 && i !== 32 && i % 8 === 0) {
                s += "."
            }
        }
        return s;
    }
    return null;
}
let binaryToIP = (input) => {
    const fields = input.split('.');
    const f1 = parseInt(fields[0], 2)
    const f2 = parseInt(fields[1], 2)
    const f3 = parseInt(fields[2], 2)
    const f4 = parseInt(fields[3], 2)
    return f1 + "." + f2 + "." + f3 + "." + f4;
}

let ipToBinary = (input) => {
    const fields = input.split('.');
    const f1 = ("00000000" + parseInt(fields[0]).toString(2)).slice(-8);
    const f2 = ("00000000" + parseInt(fields[1]).toString(2)).slice(-8);
    const f3 = ("00000000" + parseInt(fields[2]).toString(2)).slice(-8);
    const f4 = ("00000000" + parseInt(fields[3]).toString(2)).slice(-8);
    return f1 + f2 + f3 + f4;
}

let getMasque = (length) => {
    let s = "";
    for (let i = 0; i < 32; i++) {
        if (i >= length) {
            s += "0"
        } else {
            s += "1"
        }
    }
    return binaryToIP(parse(s))
}

let getNetwork = (ipBIN, length) => {
    length = parseInt(length)
    let s = ipBIN.substring(0, length);
    let s2 = ipBIN.substring(length);
    s += s2.replace(/1/g, '0');
    return binaryToIP(parse(s))
}

let getBroadcast = (ip, length) => {
    length = parseInt(length)
    let s = ip.substring(0, length);
    let s2 = ip.substring(length);
    s += s2.replace(/0/g, '1');
    return binaryToIP(parse(s))
}

let getF = (ip, length) => {
    let ipT = ipToBinary(getNetwork(ip, length))
    let ipT2 = ipT.substring(ipT.length - 1)
    ipT = ipT.substring(0, ipT.length - 1) + ipT2.replace(/0/g, '1')
    return binaryToIP(parse(ipT))
}
let getL = (ip, length) => {
    let ipT = ipToBinary(getBroadcast(ip, length))
    let ipT2 = ipT.substring(ipT.length - 1)
    ipT = ipT.substring(0, ipT.length - 1) + ipT2.replace(/1/g, '0')
    return binaryToIP(parse(ipT))
}
let getNb = (length) => {
    return Math.pow(2, (32 - length)) - 2;
}


function getBits(nbHost) {
    let i = 0;
    while (Math.pow(2, i) - 2 < nbHost) {
        i++;
    }
    return i;
}

window.onload = () => {
    ipvalue = document.getElementById("ip");
    iplength = document.getElementById("length");
    sendButton = document.getElementById("sendBtn");
    nbHost = document.getElementById("hostNB");

    pIP = document.getElementById("Aip")
    pMask = document.getElementById("mask")
    pNetwork = document.getElementById("network")
    pBroadcast = document.getElementById("broadcast")
    pFirst = document.getElementById("first")
    pLast = document.getElementById("last")
    pNb = document.getElementById("nbmachines")
    wanted = document.getElementById("wanted")
    subnet = document.getElementById("nbSubNet")
    mSubnet = document.getElementById("machineSubnet")

    sendButton.addEventListener("click", () => {
        if (isIP(ipvalue.value) && parseInt(nbHost.value) > 0 && parseInt(nbHost.value) < 65) {
            let lengthTest = parseInt(iplength.value)
            let lengthIP = (lengthTest > 0 && lengthTest < 33) ? lengthTest : 24
            nbHost = parseInt(nbHost.value)
            let binaryIP2 = ipToBinary(ipvalue.value)
            pIP.innerHTML = `Adresse : ${ipvalue.value}/${lengthIP}`;
            pMask.innerHTML = `Masque : ${getMasque(lengthIP)}`;
            pNetwork.innerHTML = `Network : ${getNetwork(binaryIP2, lengthIP)}`;
            pBroadcast.innerHTML = `Broadcast : ${getBroadcast(binaryIP2, lengthIP)}`;
            pFirst.innerHTML = `First : ${getF(binaryIP2, lengthIP)}`;
            pLast.innerHTML = `Last : ${getL(binaryIP2, lengthIP)}`;
            pNb.innerHTML = `Nb de machines : ${getNb(lengthIP)}`;
            let nbBitsMachines = getBits(nbHost)
            wanted.innerHTML = `Vous avez besoin de ${nbHost} machines soit ${nbBitsMachines} bits`
            let nbBitsSubnet = 32-lengthIP-nbBitsMachines
            subnet.innerHTML = `Nb de bits pour les sous réseaux : ${nbBitsSubnet} -> Soit ${Math.pow(2, nbBitsSubnet)} sous reseaux`
            mSubnet.innerHTML = `Nb de bits pour les machines des sous reseaux : ${nbBitsMachines} soit ${Math.pow(2, nbBitsMachines)} machines par sous reseau`
        }
    })
}