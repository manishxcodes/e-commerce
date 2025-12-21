
import cron from 'node-cron';
import { ImageDeletion } from 'models/imageToBeDeleted.model.ts';
import { deleteFromS3 } from './s3.ts';
import { constants } from 'constants/index.ts';

cron.schedule("*/30 * * * *", async() => {
    const pendingImages = await ImageDeletion.find({
        status: constants.IMAGE_DELETION_STATUS.PENDING,
        attemps: { $lt: 3}
    }).limit(50);

    for(const record of pendingImages) {
        try {
            await deleteFromS3(record.imageKey);

            record.status = constants.IMAGE_DELETION_STATUS.DELETED;
            await record.save();
        } catch(err: any) {
            record.attemps += 1;
            record.lastError = err.message;

            if(record.attemps >= 3) {
                record.status = constants.IMAGE_DELETION_STATUS.FAILED;
            }

            await record.save();
        }
    }
})