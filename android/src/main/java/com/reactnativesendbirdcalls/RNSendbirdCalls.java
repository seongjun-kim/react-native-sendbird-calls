package com.reactnativesendbirdcalls;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.sendbird.calls.AcceptParams;
import com.sendbird.calls.AuthenticateParams;
import com.sendbird.calls.CallOptions;
import com.sendbird.calls.DialParams;
import com.sendbird.calls.DirectCall;
import com.sendbird.calls.SendBirdCall;
import com.sendbird.calls.SendBirdException;
import com.sendbird.calls.User;
import com.sendbird.calls.handler.AuthenticateHandler;
import com.sendbird.calls.handler.CompletionHandler;
import com.sendbird.calls.handler.DialHandler;
import com.sendbird.calls.handler.DirectCallListener;
import com.sendbird.calls.handler.SendBirdCallListener;

public class RNSendbirdCalls extends ReactContextBaseJavaModule
  implements LifecycleEventListener {
  private ReactApplicationContext mReactApplicationContext;
  private ReactContext mReactContext;
  private String userId;
  private String sendbirdAppId;
  private boolean sendbirdCallsInitDone;
  private DirectCall call;

  RNSendbirdCalls(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactApplicationContext = reactContext;
    mReactContext = reactContext;
    mReactContext.addLifecycleEventListener(this);
  }

  /**
   * React Methods
   */

  @ReactMethod
  public void setAppId(String appId) { sendbirdAppId = appId; }

  // recommended to initialize the Calls SDK in the onCreate() method of the Application instance.
  @ReactMethod
  public void init(final Promise promise) {
    if (sendbirdCallsInitDone) {
      Log.w("RNSendbirdCalls", "Already initialized the SendbirdCalls React-Native SDK");
      return;
    }
    if (sendbirdAppId == null) {
      Log.e("RNSendbirdCalls", "sendbirdAppId is not found");
      return;
    }
    sendbirdCallsInitDone = true;

    promise.resolve(SendBirdCall.init(mReactApplicationContext, sendbirdAppId));
  }

  @ReactMethod
  public void authenticateUser(String userId, String accessToken, Callback onResult){
    // The USER_ID should be unique to your Sendbird application.
    this.userId = userId;
    AuthenticateParams params = new AuthenticateParams(userId);
    if(accessToken != null) params.setAccessToken(accessToken);

    SendBirdCall.authenticate(params, new AuthenticateHandler() {
      @Override
      public void onResult(User user, SendBirdException e) {
        if (e != null) e.printStackTrace();
        else if (onResult != null) {
          // The user has been authenticated successfully and is connected to Sendbird server.
          Log.i("RNSendbirdCalls", "The user has been authenticated successfully and is connected to Sendbird server.");
          onResult.invoke();
        }
      }
    });
  }

  @ReactMethod
  public void registerPushToken(String pushToken, Callback onResult) {
    Log.i("RNSendbirdCalls", "registerPushToken pushToken: " + pushToken);
    SendBirdCall.registerPushToken(pushToken, true, new CompletionHandler() {
      @Override
      public void onResult(@Nullable SendBirdException e) {
        if (e != null) e.printStackTrace();
        else if (onResult != null) {
          onResult.invoke();
          Log.i("RNSendbirdCalls", "The push token is registered successfully.");
        }
      }
    });
  }

  @ReactMethod
  public void addListener(Callback onEstablished, Callback onConnected, Callback onEnded, Callback onRemoteAudioSettingsChanged) {
    Log.i("RNSendbirdCalls", "addListener userId:" + userId);
    SendBirdCall.addListener(userId, new SendBirdCallListener() {
      @Override
      public void onRinging(DirectCall call) {
        Log.i("RNSendbirdCalls", "addListener onRinging:");
        call.setListener(new DirectCallListener() {
          @Override
          public void onEstablished(DirectCall call) {
            if (onEstablished != null) {
              onEstablished.invoke();
              Log.i("RNSendbirdCalls", "onEstablished is called successfully.");
            }
          }

          @Override
          public void onConnected(DirectCall call) {
            if (onEstablished != null) {
              onConnected.invoke();
              Log.i("RNSendbirdCalls", "onConnected is called successfully.");
            }
          }

          @Override
          public void onEnded(DirectCall call) {
            if (onEstablished != null) {
              onEnded.invoke();
              Log.i("RNSendbirdCalls", "onEnded is called successfully.");
            }
          }

          @Override
          public void onRemoteAudioSettingsChanged(DirectCall call) {
            if (onRemoteAudioSettingsChanged != null) {
              onEnded.invoke();
              Log.i("RNSendbirdCalls", "onRemoteAudioSettingsChanged is called successfully.");
            }
          }
        });

        call.accept(new AcceptParams());
      }
    });
  }

  @ReactMethod
  public void dial(String calleeId, final Promise promise) {
    DialParams params = new DialParams(calleeId);
    params.setVideoCall(false);
    params.setCallOptions(new CallOptions());

    call = SendBirdCall.dial(params, new DialHandler() {
      @Override
      public void onResult(DirectCall call, SendBirdException e) {
        if (e != null) e.printStackTrace();
        else {
          promise.resolve(true);
          Log.i("RNSendbirdCalls", "The call has been created successfully.");
        }
      }
    });
  }

  /**
   * Native Module Overrides
   */

  @NonNull
  @Override
  public String getName() {
    return "SendbirdCalls";
  }

  // Methods of LifecycleEventListener
  @Override
  public void onHostDestroy() {
    // removeHandlers();
    // removeObservers();
  }

  @Override
  public void onHostPause() {

  }

  @Override
  public void onHostResume() {
    // init();
  }

  @Override
  public void onCatalystInstanceDestroy() {
    // removeHandlers();
    // removeObservers();
  }
}
