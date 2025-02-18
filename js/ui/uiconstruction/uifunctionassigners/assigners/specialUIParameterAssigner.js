class SpecialUIParameterAssigner {
  static getSpecialParameterComposite(
    parameterOrganizationGroup,
    parameterValueID
  ) {
    switch (parameterOrganizationGroup) {
      case 1:
        return this.getGroup1Parameter(parameterValueID);
    }
    return parameterOrganizationGroup;
  }

  getBlankParameter() {
    return "-blank-parameter-obtained-from-parameter-assigner";
  }

  getGroup1Parameter(parameterValueID) {
    return SpecialUIGroup1Parameters.getSpecialParameterByParameterID(
      parameterValueID
    );
  }
}
