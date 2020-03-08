/**
 * Created by tdzl2003 on 2/13/16.
 */

const fetch = require('node-fetch');
let host = process.env.PUSHY_REGISTRY || 'https://update.reactnative.cn/api';
const fs = require('fs-extra');
import request from 'request';
import ProgressBar from 'progress';
const packageJson = require('../package.json');
const tcpp = require('tcp-ping');
const util = require('util');

const tcpPing = util.promisify(tcpp.ping);

let session = undefined;
let savedSession = undefined;

const userAgent = `react-native-update-cli/${packageJson.version}`;

exports.loadSession = async function() {
  if (fs.existsSync('.update')) {
    try {
      exports.replaceSession(JSON.parse(fs.readFileSync('.update', 'utf8')));
      savedSession = session;
    } catch (e) {
      console.error(
        'Failed to parse file `.update`. Try to remove it manually.',
      );
      throw e;
    }
  }
};

exports.getSession = function() {
  return session;
};

exports.replaceSession = function(newSession) {
  session = newSession;
};

exports.saveSession = function() {
  // Only save on change.
  if (session !== savedSession) {
    const current = session;
    const data = JSON.stringify(current, null, 4);
    fs.writeFileSync('.update', data, 'utf8');
    savedSession = current;
  }
};

exports.closeSession = function() {
  if (fs.existsSync('.update')) {
    fs.unlinkSync('.update');
    savedSession = undefined;
  }
  session = undefined;
  host = process.env.PUSHY_REGISTRY || 'https://update.reactnative.cn';
};

async function query(url, options) {
  const resp = await fetch(url, options);
  const json = await resp.json();
  if (resp.status !== 200) {
    throw Object.assign(new Error(json.message || json.error), {
      status: resp.status,
    });
  }
  return json;
}

function queryWithoutBody(method) {
  return function(api) {
    return query(host + api, {
      method,
      headers: {
        'User-Agent': userAgent,
        'X-AccessToken': session ? session.token : '',
      },
    });
  };
}

function queryWithBody(method) {
  return function(api, body) {
    return query(host + api, {
      method,
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/json',
        'X-AccessToken': session ? session.token : '',
      },
      body: JSON.stringify(body),
    });
  };
}

exports.get = queryWithoutBody('GET');
exports.post = queryWithBody('POST');
exports.put = queryWithBody('PUT');
exports.doDelete = queryWithBody('DELETE');

async function uploadFile(fn) {
  const { url, backupUrl, formData } = await exports.post('/upload', {});
  let realUrl = url;

  if (backupUrl) {
    const pingResult = await tcpPing({
      address: url.replace('https://', ''),
      attempts: 4,
      timeout: 1000,
    });
    // console.log({pingResult});
    if (pingResult.avg > 150) {
      realUrl = backupUrl;
    }
    // console.log({realUrl});
  }

  const fileSize = fs.statSync(fn).size;

  const bar = new ProgressBar('  Uploading [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    total: fileSize,
  });

  const info = await new Promise((resolve, reject) => {
    formData.file = fs.createReadStream(fn);

    formData.file.on('data', function(data) {
      bar.tick(data.length);
    });
    request.post(
      realUrl,
      {
        formData,
      },
      (err, resp, body) => {
        if (err) {
          return reject(err);
        }
        if (resp.statusCode > 299) {
          return reject(
            Object.assign(new Error(body), { status: resp.statusCode }),
          );
        }
        resolve(
          body
            ? // qiniu
              JSON.parse(body)
            : // aliyun oss
              { hash: formData.key },
        );
      },
    );
  });
  return info;
}

exports.uploadFile = uploadFile;
