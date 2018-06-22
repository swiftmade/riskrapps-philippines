package com.riskrapps_philippines;

import android.net.Uri;
import android.os.Build;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebViewClient;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebSettings.RenderPriority;

import com.facebook.react.common.build.ReactBuildConfig;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.webview.ReactWebViewManager;

@ReactModule(name = CustomWebViewManager.REACT_CLASS)
public class CustomWebViewManager extends ReactWebViewManager {
    /* This name must match what we're referring to in JS */
    protected static final String REACT_CLASS = "RCTCustomWebView";
    private CustomWebViewPackage aPackage;

    // pulled this code from React Native itself;
    // https://github.com/facebook/react-native/blob/59d9f8ca5eb96b4b455b60ed170dfb05bc9c7251/ReactAndroid/src/main/java/com/facebook/react/views/webview/ReactWebViewManager.java#L361
    // not sure if there is a better way of handling this overriding; ideally, I'd
    // like to **only** add the `onShowFileChooser` method, but I don't know a way
    // to handle that
    @Override
    protected WebView createViewInstance(final ThemedReactContext reactContext) {
        ReactWebView webView = (ReactWebView) super.createViewInstance(reactContext);
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage message) {
                if (ReactBuildConfig.DEBUG) {
                    return super.onConsoleMessage(message);
                }
                // Ignore console logs in non debug builds.
                return true;
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }

            // this is the addition method to react-native built-in
            // it calls the photo picker intent in a separate module apparently so all the parts that need to can access other bits in scope. I wish I understood more Java, but this is the way https://github.com/hushicai/ReactNativeAndroidWebView did it, and it seems to work
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                    FileChooserParams fileChooserParams) {
                return getModule().startPhotoPickerIntent(filePathCallback, fileChooserParams);
            }
        });
        
        // force web content debugging on
        WebView.setWebContentsDebuggingEnabled(true);
        // Enable access to GPS
        webView.getSettings().setGeolocationEnabled(true);
        // User-Agent string is overridden because if Enketo thinks this is an Android device,
        // It replaces native select elements instead of bootstrap dropdowns.
        // Native select elements don't work at all in React Native WebViews on Android tablets for some reason.
        webView.getSettings().setUserAgentString("ssas");
        webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        webView.getSettings().setRenderPriority(RenderPriority.HIGH);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            // chromium, enable hardware acceleration
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        } else {
            // older android version, disable hardware acceleration
            webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }

        return webView;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected void addEventEmitters(ThemedReactContext reactContext, WebView view) {
        view.setWebViewClient(new CustomWebViewClient());
    }

    public CustomWebViewPackage getPackage() {
        return this.aPackage;
    }

    public void setPackage(CustomWebViewPackage aPackage) {
        this.aPackage = aPackage;
    }

    public CustomWebViewModule getModule() {
        return this.aPackage.getModule();
    }

    protected static class CustomWebViewClient extends ReactWebViewClient {
        
        @Override
        public void onPageFinished(WebView webView, String url) {
            super.onPageFinished(webView, url);
            webView.scrollTo(1, 0);
            webView.scrollTo(0, 0);
        }  
    
    }
}