import { mocked } from 'ts-jest/utils';
import { DocumentClient } from "../../__mocks__/aws-sdk/clients/dynamodb";
import * as UsersService from "../../services/usersService";
import { EditableUserPortfolio } from '../../types/userPortfolio';

const mockDynamoDB = new DocumentClient();

describe("User Service Test Suite", () => {

    describe('generateUpdateExpression', () => {

        describe('When an object with properties is passed ', () => {

            test("Then object properties should be converted to the expected update expression format", () => {
                //Arrange
                const object = {
                    "firstName": "Gabriel",
                    "lastName": "Huertas",
                    "description": "Backend Dev"
                };

                const expectedUpdateExpression = {
                    ExpressionAttributeNames: {
                        "#firstName": "firstName",
                        "#lastName": "lastName",
                        "#description": "description"
                    },
                    ExpressionAttributeValues: {
                        ":firstName": "Gabriel",
                        ":lastName": "Huertas",
                        ":description": "Backend Dev"
                    },
                    UpdateExpression: "set #firstName = :firstName, #lastName = :lastName, #description = :description"
                }

                //Act
                const actualUpdateExpression = UsersService.generateUpdateExpression(object);
                //Assert
                expect(actualUpdateExpression).toEqual(expectedUpdateExpression);
            });
        });

        describe('When an empty object is passed ', () => {

            test("Then update expression should be empty", () => {
                //Arrange
                const object = {};

                //Act
                const actualUpdateExpression = UsersService.generateUpdateExpression(object);
                //Assert
                expect(actualUpdateExpression.ExpressionAttributeNames).toEqual({});
                expect(actualUpdateExpression.ExpressionAttributeValues).toEqual({});
            });
        });
    });

    describe('getUserPortfolioInfo', () => {

        describe('When getUserPortfolioInfo is called', () => {

            test("Then DynamoDB get function should have been called with expected parameters", async () => {

                const userId = '1234';
                const expectedParams = {
                    TableName: "users",
                    Key: {
                        id: userId
                    }
                };


                mockDynamoDB.get.mockImplementationOnce(() => {
                    return {
                        promise: jest.fn().mockResolvedValueOnce({
                            Item: {
                                id: { S: "1" },
                                description: { S: "Adele Laurie Blue Adkins (Londres, 5 de mayo de 1988), conocida simplemente como Adele, es una cantante, compositora y multinstrumentista británica.3? Desde muy joven mostró su interés por la música y en 2006 egresó de la BRIT School de Artes Escénicas y" },
                                profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_2016.jpg/1280px-Adele_2016.jpg" },
                                username: { S: "Adele" },
                                title: { S: "Adele" },
                                userId: { S: "184910040" },
                                experienceSummary: { S: "Not specified" },
                                lastName: { S: "Blue " },
                                firstName: { S: "Adele" }
                            }
                        })
                    }
                });

                await UsersService.getUserPortfolioInfo(userId);
                expect(mockDynamoDB.get).toHaveBeenCalledWith(expectedParams);
            });
        });
    })

    describe('updateUserPortfolio', () => {

        describe('When updateUserPortfolio is called', () => {

            test("Then DynamoDB get function should have been called with expected parameters", async () => {
                //Arrange
                const userId = '1234';
                const fieldsToUpdate: EditableUserPortfolio = {
                    "firstName": "Gabriel",
                    "lastName": "Huertas",
                    "description": "Backend Dev"
                };
                const expectedUpdateParams = {
                    TableName: "users",
                    Key: { id: userId },
                    ExpressionAttributeNames: {
                        "#firstName": "firstName",
                        "#lastName": "lastName",
                        "#description": "description"
                    },
                    ExpressionAttributeValues: {
                        ":firstName": "Gabriel",
                        ":lastName": "Huertas",
                        ":description": "Backend Dev"
                    },
                    UpdateExpression: "set #firstName = :firstName, #lastName = :lastName, #description = :description",
                    ReturnValues: "ALL_NEW"
                };

                mockDynamoDB.get.mockImplementationOnce(() => {
                    return {
                        promise: jest.fn().mockResolvedValueOnce({
                            Item: {
                                id: { S: "1" },
                                description: { S: "Adele Laurie Blue Adkins (Londres, 5 de mayo de 1988), conocida simplemente como Adele, es una cantante, compositora y multinstrumentista británica.3? Desde muy joven mostró su interés por la música y en 2006 egresó de la BRIT School de Artes Escénicas y" },
                                profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_2016.jpg/1280px-Adele_2016.jpg" },
                                username: { S: "Adele" },
                                title: { S: "Adele" },
                                userId: { S: "184910040" },
                                experienceSummary: { S: "Not specified" },
                                lastName: { S: "Blue " },
                                firstName: { S: "Adele" }
                            }
                        })
                    }
                });

                await UsersService.updateUserPortfolio(userId, fieldsToUpdate);
                expect(mockDynamoDB.update).toHaveBeenCalledWith(expectedUpdateParams);
            });
        });
    });
});