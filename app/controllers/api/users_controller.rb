module Api
  class UsersController < ApplicationController
    def create
      @user = User.new(user_params)

      if @user.save
        render json: { success: true }, status: :created
      else
        render json: { error: @user.error }, status: :bad_request
      end    
    end

    private

    def user_params
      params.require(:user).permit(:username, :password, :email)
    end
  end
end
