"""Read generated alpha plates and describe their eight render regions.

Does not edit the artwork. Writes run-length region metadata used by Canvas
at runtime to move the already-separated illustrated modules independently.
Requires Pillow, NumPy and SciPy for this offline analysis step only.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT=Path(__file__).resolve().parents[1]
VARIANTS={'red':'red-carbon-blue','white':'pearl-white-carbon','green':'emerald-carbon-gold'}
for color,slug in VARIANTS.items():
    im=Image.open(ROOT/f'assets/source/images/exploded/pagani-huayra-bc-{slug}-exploded.png')
    alpha=np.asarray(im)[:,:,3]
    labels,count=ndimage.label(alpha>30)
    nearest=ndimage.distance_transform_edt(alpha<=30,return_distances=False,return_indices=True)
    labels=np.where(alpha>0,labels[tuple(nearest)],0)
    counts=np.bincount(labels.ravel()); boxes=ndimage.find_objects(labels)
    groups={name:np.zeros(alpha.shape,dtype=bool) for name in ['body','wing','engine','chassis','wheel-far-front','wheel-near-front','wheel-near-rear','wheel-far-rear']}
    big=[]
    for label in range(1,count+1):
        if counts[label]<1000:continue
        ys,xs=boxes[label-1]; x=(xs.start+xs.stop)/2;y=(ys.start+ys.stop)/2
        if xs.stop-xs.start>900 and ys.start<50:
            yy,xx=np.indices(alpha.shape)
            # The illustration's wing and shell meet at a narrow silhouette seam.
            wing=(xx>=1200)|((xx>=1148)&(yy<218))
            groups['wing']|=(labels==label)&wing
            groups['body']|=(labels==label)&~wing
            big.append((label,'body',x,y));continue
        if xs.stop<350 and ys.start<100 and ys.stop>400:
            yy=np.indices(alpha.shape)[0]
            groups['wheel-far-front']|=(labels==label)&(yy<217)
            groups['wheel-near-front']|=(labels==label)&(yy>=217)
            big.append((label,'wheel-near-front',x,y));continue
        if xs.stop-xs.start>800:name='chassis'
        elif x>900 and y<610:name='engine'
        elif x>1200:name='wheel-far-rear'
        elif y<230:name='wheel-far-front'
        elif y<500:name='wheel-near-front'
        else:name='wheel-near-rear'
        groups[name]|=labels==label;big.append((label,name,x,y))
    # Preserve tiny disconnected highlights by assigning them to the nearest module.
    for label in range(1,count+1):
        if counts[label]>=1000:continue
        ys,xs=boxes[label-1];x=(xs.start+xs.stop)/2;y=(ys.start+ys.stop)/2
        name=min(big,key=lambda item:(x-item[2])**2+(y-item[3])**2)[1]
        groups[name]|=labels==label
    total=np.zeros(alpha.shape,dtype=np.uint8)
    result=[]
    for name,mask in groups.items():
        assert mask.any(),f'{color}: missing {name}'
        total+=mask
        ys,xs=np.where(mask);x0,x1=int(xs.min()),int(xs.max())+1;y0,y1=int(ys.min()),int(ys.max())+1
        runs=[]
        for y in range(y0,y1):
            row=np.pad(mask[y,x0:x1].astype(np.int8),(1,1));changes=np.diff(row)
            starts=np.where(changes==1)[0];ends=np.where(changes==-1)[0]
            for a,b in zip(starts,ends):runs.append([y-y0,int(a),int(b-a)])
        result.append({'id':name,'bounds':[x0,y0,x1-x0,y1-y0],'runs':runs})
    assert np.all(total[alpha>0]==1),'Every painted pixel must belong to exactly one module'
    out={'width':im.width,'height':im.height,'layers':result}
    (ROOT/f'public/assets/images/exploded/{color}.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
    print(color,[(g['id'],g['bounds']) for g in result])
