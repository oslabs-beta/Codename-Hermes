import React from 'react';
import Image from 'next/image';
import styles from '../styles/index.module.scss';
import apirateslifeforme from '../../public/apirateslifeforme.png';
import dotsoncardstock from '../../public/dotsoncardstock.png';
import heart from '../../public/heart.png';
import seaturtle from '../../public/seaturtle.png';
import starrynightmixedmedia from '../../public/starrynightmixedmedia.png';
import undertherainbow from '../../public/undertherainbow.png';
import underwaterseascape from '../../public/underwaterseascape.png';

interface Art {
  title: string;
  file: string;
}

const artWork: Art[] = [
  { title: 'A Pirates Life for Me', file: apirateslifeforme },
  { title: 'Dots on Cardstock', file: dotsoncardstock },
  { title: 'Heart', file: heart },
  { title: 'Sea Turtle', file: seaturtle },
  { title: 'Starry Night Mixed Media', file: starrynightmixedmedia },
  { title: 'Under the Rainbow', file: undertherainbow },
  { title: 'Underwater Seascape', file: underwaterseascape },
];

const Gallery = () => {
  return (
    <div>
      <div className={styles.galHeading}>Welcome to CH Gallery</div>
      <br />
      <p className={styles.galDescrip}>
        This exhibit features a diverse array of works created with a variety of
        mediums, including crayon, marker, pencil, and even flower petals. The
        pieces on display showcase a range of subjects, from realistic
        depictions of everyday life to whimsical images of fantasy and
        imagination. Each piece in the collection is a testament to the
        creativity and skill of its artist.
      </p>
      <br />
      <p className={styles.galDescrip}>
        The crayon drawings evoke a sense of childhood nostalgia, with bright,
        bold colors and simple yet charming compositions. The collection also
        includes pieces created with unconventional materials, such as flower
        petals. These works incorporate natural elements in a way that is both
        beautiful and thought-provoking.
      </p>
      <br />
      <p className={styles.galDescrip}>
        Whether the images are based on real life or the imagination, each piece
        in this exhibit is a unique expression of the {"artist's"} vision. We
        invite you to take a closer look and discover the beauty and diversity
        of these wonderful works of art.
      </p>

      <div>
        <div className={styles.galDisp}>
          {artWork.map((obj, index) => (
            <div className={styles.galImg} key={index}>
              <Image src={obj.file} key={index} alt={"Mabel's art"} />
              <p key={index}>{obj.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
