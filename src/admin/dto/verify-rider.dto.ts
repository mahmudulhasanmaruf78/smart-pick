import { IsEnum, IsNotEmpty } from 'class-validator';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';

export class VerifyRiderDto {
  @IsNotEmpty()
  @IsEnum(VerificationStatus, {
    message: 'Status must be approved or rejected',
  })
  status: VerificationStatus;
}
