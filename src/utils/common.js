const HEAT_HALF_LIFE = 30; // days
import jwt_decode from "jwt-decode";
import some from "lodash/some";

export const resize = (url, minWidth)=> {
  let width;
  if (url && !url.match(/\.svg$/)) {
    width = minWidth * (window.devicePixelRatio || 1);
    return url + "?imageMogr2/format/jpg/interlace/1/thumbnail/" + width + "x";
  } else {
    return url;
  }
};

export const resizeHeight = (url, minHeight)=> {
  let height;
  if (url && !url.match(/\.svg$/)) {
    height = minHeight * (window.devicePixelRatio || 1);
    return url + "?imageMogr2/format/jpg/interlace/1/thumbnail/x" + height;
  } else {
    return url;
  }
};

export const calculateHeat = (heatObj, like_amount = 0) => {
  const last_heat = heatObj.point;
  const late_modified = heatObj.modified;
  const max_heat = heatObj.max_point;
  const q = 0.5 ** ((+Date.now() - +new Date(late_modified)) / (HEAT_HALF_LIFE * 24 * 60 * 60 * 1000));
  const new_heat = (last_heat + like_amount) * q;
  return Math.round(new_heat > max_heat / 2 ? new_heat : max_heat / 2);
};

export const imageHeight = (rawWidth, rawHeight, newWidth)=> newWidth / rawWidth * rawHeight;

export const checkTokenValid = ()=> {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const tokenPayload = jwt_decode(token);
      if (tokenPayload && ((tokenPayload.exp * 1000) - 3600) > +new Date()) {
        return {valid: true, needRefresh: false};
      }
    } catch (e) {
      console.info('decode jwt error');
    }
    console.info('jwt expired');
    localStorage.removeItem('token');
    return {valid: false, needRefresh: true};
  }
  return {valid: false, needRefresh: false};
};

export const getScrollBarWidth = ()=> {
  const inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  const outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild(inner);

  document.body.appendChild(outer);
  let w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild(outer);

  return (w1 - w2);
};

export const compareAttrs = (obj1, obj2, attrs, isArray = false)=> {
  return some(attrs, (attr)=> obj1[attr] !== obj2[attr]);
};
