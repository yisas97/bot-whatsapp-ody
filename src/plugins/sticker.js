const {
    besoEstatico1,
    besoEstatico10,
    besoEstatico2,
    besoEstatico3,
    besoEstatico4,
    besoEstatico5,
    besoEstatico6,
    besoEstatico7,
    besoEstatico8,
    besoEstatico9,
    casadoEstatico1,
    casadoEstatico2,
    casadoEstatico3,
    casadoEstatico4, casadoEstatico5, divorciadoEstatico1, divorciadoEstatico2, divorciadoEstatico3, divorciadoEstatico4,
    feliz1, feliz2, feliz3, feliz4, feliz5, feliz6, feliz7, feliz8, feliz9, feliz10, feliz11, feliz12, feliz13, feliz14,
    feliz15,
    abrazo1,abrazo2,abrazo3,abrazo4,abrazo5,abrazo6,abrazo7,abrazo8,
    golpe1, golpe2, golpe3, golpe4, golpe5, golpe6, golpe7, golpe8,
    dance1, dance2, dance3, dance4,
    kuru1
} = require( "../stickers/stickerEstaticos");
const {Sticker, StickerTypes} = require( "wa-sticker-formatter");
const {getRandomElement} = require( "../utils/util");



async function insertSticker(sock,numberWa, type) {
    let sticker;
    let arrayEstatico;
    let randomElement;
    let gitBuffer;
    switch (type) {
        case 0:
            arrayEstatico = [besoEstatico1, besoEstatico2, besoEstatico3, besoEstatico4, besoEstatico5, besoEstatico6, besoEstatico7, besoEstatico8, besoEstatico9, besoEstatico10];
            randomElement = getRandomElement(arrayEstatico);
            gitBuffer = Buffer.from(randomElement, 'base64');

            sticker = await new Sticker(gitBuffer, {
                pack: `Besos estaticos`,
                author: 'Jesus',
                type: StickerTypes.DEFAULT,
                categories: ['🤩', '🎉'],
                quality: 100,
            }).build()

            return await sock.sendMessage(
                numberWa,
                {
                    sticker
                }
            );
        case 1:
            arrayEstatico = [casadoEstatico1,casadoEstatico2,casadoEstatico3,casadoEstatico4,casadoEstatico5];
            randomElement = getRandomElement(arrayEstatico);
            gitBuffer = Buffer.from(randomElement, 'base64');
            sticker = await new Sticker(gitBuffer, {
                pack: 'Casados ODY',
                author: 'Jesus',
                type: StickerTypes.DEFAULT,
                categories: ['🤩', '🎉'],
                quality: 100,
            }).build()

            return await sock.sendMessage(
                numberWa,
                {
                    sticker
                }
            );
        case 2:
            arrayEstatico = [divorciadoEstatico1,divorciadoEstatico2,divorciadoEstatico3,divorciadoEstatico4];
            randomElement = getRandomElement(arrayEstatico);
            gitBuffer = Buffer.from(randomElement, 'base64');

            sticker = await new Sticker(gitBuffer, {
                pack: 'My Sticker',
                author: 'Jesus',
                type: StickerTypes.DEFAULT,
                categories: ['🤩', '🎉'],
                quality: 100,
            }).build()

            return await sock.sendMessage(
                numberWa,
                {
                    sticker
                }
            );
        case 3:
            arrayEstatico = [
                feliz1,
                feliz2,
                feliz3,
                feliz4,
                feliz5,
                feliz6,
                feliz7,
                feliz8,
                feliz9,
                feliz10,
                feliz11,
                feliz12,
                feliz13,
                feliz14,
                feliz15
            ];
            randomElement = getRandomElement(arrayEstatico);
            gitBuffer = Buffer.from(randomElement, 'base64');

            sticker = await new Sticker(gitBuffer, {
                pack: 'My Sticker',
                author: 'Darkness',
                type: StickerTypes.DEFAULT,
                categories: ['🤩', '🎉'],
                quality: 100,
            }).build()

            return await sock.sendMessage(
                numberWa,
                {
                    sticker
                }
            );
            case 4:
                arrayEstatico = [
                   abrazo1,
                   abrazo2,
                   abrazo3,
                   abrazo4,
                   abrazo5,
                   abrazo6,
                   abrazo7,
                   abrazo8
                ];
                randomElement = getRandomElement(arrayEstatico);
                gitBuffer = Buffer.from(randomElement, 'base64');
    
                sticker = await new Sticker(gitBuffer, {
                    pack: 'My Sticker',
                    author: 'Darkness',
                    type: StickerTypes.DEFAULT,
                    categories: ['🤩', '🎉'],
                    quality: 100,
                }).build()
    
                return await sock.sendMessage(
                    numberWa,
                    {
                        sticker
                    }
                );
                case 5:
                arrayEstatico = [
                    golpe1,
                    golpe2,
                    golpe3,
                    golpe4,
                    golpe5,
                    golpe6,
                    golpe7,
                    golpe8
                ];
                randomElement = getRandomElement(arrayEstatico);
                gitBuffer = Buffer.from(randomElement, 'base64');
    
                sticker = await new Sticker(gitBuffer, {
                    pack: 'My Sticker',
                    author: 'Darkness',
                    type: StickerTypes.DEFAULT,
                    categories: ['🤩', '🎉'],
                    quality: 100,
                }).build()
    
                return await sock.sendMessage(
                    numberWa,
                    {
                        sticker
                    }
                );
                case 6:
                    arrayEstatico = [
                        dance1,
                        dance2,
                        dance3,
                        dance4
                    ];
                    randomElement = getRandomElement(arrayEstatico);
                    gitBuffer = Buffer.from(randomElement, 'base64');
        
                    sticker = await new Sticker(gitBuffer, {
                        pack: 'My Sticker',
                        author: 'Darkness',
                        type: StickerTypes.DEFAULT,
                        categories: ['🤩', '🎉'],
                        quality: 100,
                    }).build()
        
                    return await sock.sendMessage(
                        numberWa,
                        {
                            sticker
                        }
                    );
                    case 7:
                        arrayEstatico = [
                            kuru1,
                        ];
                        randomElement = getRandomElement(arrayEstatico);
                        gitBuffer = Buffer.from(randomElement, 'base64');
            
                        sticker = await new Sticker(gitBuffer, {
                            pack: 'My Sticker',
                            author: 'Darkness',
                            type: StickerTypes.DEFAULT,
                            categories: ['🤩', '🎉'],
                            quality: 100,
                        }).build()
            
                        return await sock.sendMessage(
                            numberWa,
                            {
                                sticker
                            }
                        );

    }

}

module.exports =  {
    insertSticker
}