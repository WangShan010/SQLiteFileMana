define(["exports","./ComponentDatatype-3d0a0aac"],(function(t, n){"use strict";const o={computePositions:function(t, o, e, s, a){const r=.5*t,c=-r,i=s+s,u=new Float64Array(3*(a?2*i:i));let y,f=0,m=0;const p=a?3*i:0,d=a?3*(i+s):3*s;for(y=0; y<s; y++){const t=y/s*n.CesiumMath.TWO_PI,i=Math.cos(t),h=Math.sin(t),l=i*e,C=h*e,M=i*o,P=h*o;u[m+p]=l,u[m+p+1]=C,u[m+p+2]=c,u[m+d]=M,u[m+d+1]=P,u[m+d+2]=r,m+=3,a&&(u[f++]=l,u[f++]=C,u[f++]=c,u[f++]=M,u[f++]=P,u[f++]=r)}return u}};t.CylinderGeometryLibrary=o}));