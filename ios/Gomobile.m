#import "Gomobile.h"
#import <UIKit/UIKit.h>

@implementation Gomobile

RCT_EXPORT_MODULE(PrivacyGo);

//exports a method createTransaction to javascript
RCT_EXPORT_METHOD(createTransaction:(NSString *)data time:(NSInteger)time callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileCreateTransaction(data, time, nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSignPublicKey:(NSString *)data time:(NSInteger)time callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileGetSignPublicKey(data, time, nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(signPoolWithdraw:(NSString *)data time:(NSInteger)time callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileSignPoolWithdraw(data, time, nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(createConvertTx:(NSString *)data time:(NSInteger)time callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileCreateConvertTx(data, time, nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(newKeySetFromPrivate:(NSString *)data time:(NSInteger)time callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileNewKeySetFromPrivate(data, time, nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(decryptCoin:(NSString *)data time:(NSInteger)time callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileDecryptCoin(data, time, nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(createCoin:(NSString *)data time:(NSInteger)time callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileCreateCoin(data, time, nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(generateBLSKeyPairFromSeed:(NSString *)data time:(NSInteger)time callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileGenerateBLSKeyPairFromSeed(data, time, nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(hybridEncrypt:(NSString *)data time:(NSInteger)time callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileHybridEncrypt(data, time, nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(hybridDecrypt:(NSString *)data time:(NSInteger)time callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileHybridDecrypt(data, time, nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

@end
