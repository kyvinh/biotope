-- AlterTable
ALTER TABLE `reputationaction` MODIFY `actionType` ENUM('REGISTER_EMAIL', 'REGISTER_CODE', 'REGISTER_IRL', 'REGISTER_POSTAL', 'HAS_REGISTERED_IRL', 'SEND_INVITE', 'ANSWER_QUESTION', 'ARGUMENT_ANSWER', 'CREATE_ANSWER', 'UPVOTE_ARGUMENT', 'FLAG_ARGUMENT', 'EDIT_ARGUMENT', 'CREATE_QUESTION') NOT NULL;