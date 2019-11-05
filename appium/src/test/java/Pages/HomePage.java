/*
 * Copyright 2014-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

package Pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileElement;
import io.appium.java_client.pagefactory.AndroidFindBy;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

/**
 * A home page
 */
public class HomePage extends BasePage {
    private static final int KEYBOARD_ANIMATION_DELAY = 1000;

    /**
     * The hello world text view
     */
    @AndroidFindBy(id = "com.example.myapplication:id/textViewHelloWorld")
    private MobileElement helloWorldTextView;

    /**
     * The user name input
     */
    @AndroidFindBy(id = "com.example.myapplication:id/editText")
    private MobileElement messageField;

    /**
     * The password input
     */
    @AndroidFindBy(id = "com.example.myapplication:id/button")
    private MobileElement submitButton;

    public HomePage(AppiumDriver driver) {
        super(driver);
    }

    /**
     *
     * @return the hello world text
     */
    public String getHelloWorldMessage() {
        return helloWorldTextView.getText();
    }

    /**
     * Checks to see if on home page
     *
     * @return is on home page
     */
    public boolean checkIfOnHomePage() {
        return helloWorldTextView.isDisplayed();
    }

    /**
     * Submits a test message to the form
     *
     * @param message the message
     *
     * @return true if message was entered in correctly, else false.
     */
    public boolean sendMessage(String message) throws InterruptedException {
        boolean messageStatus = sendKeysToElement(message, messageField, false);
        Thread.sleep(KEYBOARD_ANIMATION_DELAY);
        submitButton.click();

        return messageStatus;
    }
}