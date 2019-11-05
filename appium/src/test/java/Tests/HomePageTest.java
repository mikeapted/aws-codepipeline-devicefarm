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

package Tests;

import cucumber.api.CucumberOptions;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;


import Pages.HomePage;
import Tests.AbstractBaseTests.TestBase;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

/**
 * Tests for the home page
 */


@CucumberOptions(
        strict = true,
        monochrome = true,
        features = "classpath:HomePageTest",
        plugin = {"pretty"}
)
public class HomePageTest extends TestBase {
    private static final String HELLO_WORLD_SUCCESS_MESSAGE = "Hello World!";
    private static final String CORRECT_MSG = "This is a test";

    private HomePage homePage;

    @Override
    public String getName() {
        return "Home Page";
    }

    /**
     * Creates a home page
     */
    @Given("^I start at the home page$")
    public void setUpPage() {
        homePage = new HomePage(driver);
    }

    /**
     * Tests home page by verifying if the hello world message is visible
     */
    @Given("^hello world text is visible$")
    public void helloWorldSetupSuccess() throws InterruptedException {
        Assert.assertTrue(homePage.checkIfOnHomePage());
    }

    /**
     * Tests home page by verifying if the hello world message is correct
     */
    @Given("^hello world text is correct$")
    public void helloWorldTextSuccess() throws InterruptedException {
        Assert.assertEquals(homePage.getHelloWorldMessage(), HELLO_WORLD_SUCCESS_MESSAGE);
    }

    /**
     * Tests message submission by verifying if the output message is
     * correct
     */
    @Given("^message is correct$")
    public void messageSuccess() throws InterruptedException {
        Assert.assertTrue(homePage.sendMessage(CORRECT_MSG));
        // Assert.assertEquals(loginPage.getMessage(), LOGIN_SUCCESS_MESSAGE);
    }
}