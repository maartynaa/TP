import os
import cv2

for n in range(33):
    imagePath = os.path.join(str( n ) + ".PNG")
    img = cv2.imread(imagePath)
    img1 = img[:, :img.shape[1]//2,:]
    img2 = img[:, img.shape[1]//2:,:]
    if img1.shape[1]+img2.shape[1]!=img.shape[1]:
        print('error')
    cv2.imwrite(str(n)+'_1.png', img1)
    cv2.imwrite(str(n)+'_2.png', img2)